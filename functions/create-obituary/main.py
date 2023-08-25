import base64
import hashlib
from botocore.exceptions import ClientError
from requests_toolbelt.multipart import decoder
import os
import requests
import boto3
import json
import time


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('obituaries')
ssm = boto3.client('ssm')

params = ssm.get_parameters_by_path(
    Path='/the-last-show/', WithDecryption=True)

params = {item['Name']: item['Value'] for item in params['Parameters']}


def get_param(param_name):
    return params[param_name]


def lambda_handler(event, context):
    body = event['body']
    body = base64.b64decode(body)
    decoded = decoder.MultipartDecoder(body, event['headers']['content-type'])
    name = decoded.parts[0].text
    born_year = decoded.parts[1].text
    died_year = decoded.parts[2].text
    image = decoded.parts[3].content
    filename = os.path.join("/tmp", "image.jpeg")
    with open(filename, "wb") as f:
        f.write(image)
    image_url = upload_to_cloudinary(filename, resource_type="image")
    obituary = ask_gpt(name, born_year, died_year)
    mp3_url = read_this(obituary, name)

    try:
        table.put_item(Item={
            'name': name,
            'born_year': born_year,
            'died_year': died_year,
            'obituary': obituary,
            'image_url': image_url,
            'mp3_url': mp3_url,
        })

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'success'
            })
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': str(e)
            })
        }


def upload_to_cloudinary(filename, resource_type="image", ):
    """Uploads file at filename path to Cloudinary"""
    api_key = get_param("/the-last-show/api-key")
    cloud_name = "dfonr84pq"
    api_secret = get_param("/the-last-show/api-secret")
    timestamp = int(time.time())

    body = {
        "api_key": api_key,
        "timestamp": timestamp,
        "eager": "e_art:zorro"
    }
    files = {
        "file": open(filename, "rb")
    }

    body["signature"] = create_signature(body, api_secret)
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, data=body, files=files)
    if resource_type == "image":
        return res.json()["eager"][0]["secure_url"]
    else:
        return res.json()["secure_url"]


def create_signature(body, api_secret):
    exclude = ["api_key", "resource_type", "cloud_name"]
    sorted_body = sort_dictionary(body, exclude)
    query_string = create_query_string(sorted_body)
    query_string_appended = f"{query_string}{api_secret}"
    hashed = hashlib.sha1(query_string_appended.encode())
    signature = hashed.hexdigest()
    return signature


def sort_dictionary(dictionary, exclude):
    return {k: v for k, v in sorted(dictionary.items(), key=lambda item: item[0]) if k not in exclude}


def create_query_string(body):
    query_string = ""
    for idx, (k, v) in enumerate(body.items()):
        query_string += f"{k}={v}" if idx == 0 else f"&{k}={v}"
    return query_string


def ask_gpt(name, born_year, died_year):
    url = "https://api.openai.com/v1/completions"
    api_key = get_param("/the-last-show/chat-gpt-api")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "model": "text-curie-001",
        "prompt": f"write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}",
        "max_tokens": 400,
        "temperature": 0.5
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()['choices'][0]['text']


def read_this(text, name):
    client = boto3.client('polly')
    response = client.synthesize_speech(
        Engine='standard',
        LanguageCode='en-US',
        OutputFormat='mp3',
        Text=text,
        TextType='text',
        VoiceId='Joanna'
    )
    filename = f"/tmp/{name}.mp3"
    with open(filename, "wb") as f:
        f.write(response["AudioStream"].read())

    mp3_url = upload_to_cloudinary(filename, resource_type="raw")
    return mp3_url
