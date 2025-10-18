"""Test requests library basic functionality"""
import requests

# Test Response creation with mock data
r = requests.Response("test data", 200, {"Content-Type": "text/plain"}, "http://example.com")
print(r.text)
print(r.status_code)
print(r.ok)
print(r.reason)

# Test HTTP methods exist
print(hasattr(requests, 'get'))
print(hasattr(requests, 'post'))
print(hasattr(requests, 'put'))
print(hasattr(requests, 'patch'))
print(hasattr(requests, 'head'))
print(hasattr(requests, 'options'))

# Test Session
s = requests.Session()
print(hasattr(s, 'get'))
s.close()

# Test exceptions exist
print(hasattr(requests, 'RequestException'))
print(hasattr(requests, 'HTTPError'))
