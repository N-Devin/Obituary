import os
from main import *


# def test_gpt():
#     # Test the ask_gpt function
#     name = "John Doe"
#     born_year = "1990"
#     died_year = "2020"
#     response = ask_gpt(name, born_year, died_year)
#     print(response)
#     assert len(response) > 0


def test_upload():
    filename = "cat.jpeg"
    res = upload_to_cloudinary(filename)
    print(res)
    assert res is not None


# def test_get_param():
#     param_name = "/the-last-show/chat-gpt-api"
#     value = get_param(param_name)
#     print(value)
#     assert value is not None


# def test_upload():
#     filename = "monke.JPEG"
#     res = upload_to_cloudinary(filename)
#     print(res)
#     assert res is not None


# def test_upload():
#     filename = "polly.mp3"
#     res = upload_to_cloudinary(filename, resource_type="raw")
#     assert res is not None

# def test_gpt():
#     name = "John Doe"
#     born_year = "1990"
#     died_year = "2020"
#     res = ask_gpt(name, born_year, died_year)
#     print(res)
#     assert len(res) > 0

# def test_polly():
#     text = "U of C is the greatest university in the world!"
#     res = read_this(text)
#     assert res is not None
