import requests

url = "http://127.0.0.1:8000/api/review/"

with open("example.py", "rb") as f:  # make sure test_review.py is in same folder as example.py
    files = {'file': f}
    response = requests.post(url, files=files)

print(response.json())
