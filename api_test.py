import requests

req = requests.put('http://0.0.0.0:8080/bank/check_bank/1/')
print(req.text)
