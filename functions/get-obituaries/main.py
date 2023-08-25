import boto3
from boto3.dynamodb.conditions import Key
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('obituaries')


def lambda_handler(event, context):
    try:
       # Scan the table to get all items
        res = table.scan()

        # Extract the desired attributes from each item and return a list of all items
        items = []
        for item in res['Items']:
            name = item['name']
            born_year = item['born_year']
            died_year = item['died_year']
            obituary = item['obituary']
            image_url = item['image_url']
            mp3_url = item['mp3_url']

            items.append({
                'name': name,
                'born_year': born_year,
                'died_year': died_year,
                'obituary': obituary,
                'image_url': image_url,
                'mp3_url': mp3_url,
            })

        # Return the list of items as the function response
        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': str(e)
            })
        }
