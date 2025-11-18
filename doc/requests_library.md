# Requests Library - Skulpt Implementation

## Overview

The Skulpt `requests` library is a JavaScript implementation of the Python requests library, providing a simple HTTP library for making web requests. This implementation includes the most commonly used features from the standard Python requests library.

## Features

### HTTP Methods

The library supports all major HTTP methods:

```python
import requests

# GET request
response = requests.get('https://api.example.com/data')

# POST request
response = requests.post('https://api.example.com/submit', data={'key': 'value'})

# PUT request
response = requests.put('https://api.example.com/update/1', json={'name': 'Updated'})

# HEAD request (headers only, no body)
response = requests.head('https://api.example.com/check')

# OPTIONS request (check allowed methods)
response = requests.options('https://api.example.com/resource')

# PATCH request (partial update)
response = requests.patch('https://api.example.com/update/1', json={'status': 'active'})

# Generic request method
response = requests.request('GET', 'https://api.example.com/data')

# DELETE (use request method due to JS reserved word limitation)
response = requests.request('DELETE', 'https://api.example.com/resource/1')
```

### Request Parameters

All request methods support these parameters:

- **params**: URL query parameters (dict)
- **data**: Request body data (dict or string)
- **json**: JSON data (automatically sets Content-Type header)
- **headers**: Custom HTTP headers (dict)
- **cookies**: Cookies to send (dict)
- **timeout**: Request timeout in seconds

```python
# URL parameters
response = requests.get('https://api.example.com/search',
                       params={'q': 'python', 'page': 1})
# Results in: https://api.example.com/search?q=python&page=1

# Form data
response = requests.post('https://api.example.com/login',
                        data={'username': 'user', 'password': 'pass'})

# JSON data
response = requests.post('https://api.example.com/api/users',
                        json={'name': 'John', 'age': 30})

# Custom headers
response = requests.get('https://api.example.com/data',
                       headers={'Authorization': 'Bearer token123'})

# Cookies
response = requests.get('https://api.example.com/private',
                       cookies={'session_id': 'abc123'})

# Timeout
response = requests.get('https://api.example.com/slow', timeout=5)
```

### Response Object

The Response object contains all the information about the HTTP response:

```python
response = requests.get('https://api.example.com/data')

# Response attributes
print(response.text)          # Response body as text
print(response.content)       # Response body (same as text in Skulpt)
print(response.status_code)   # HTTP status code (e.g., 200, 404)
print(response.ok)            # True if status_code < 400
print(response.reason)        # Status reason phrase (e.g., "OK", "Not Found")
print(response.headers)       # Response headers dict
print(response.url)           # Final URL (after redirects)
print(response.encoding)      # Content encoding (default: 'utf-8')
print(response.cookies)       # Response cookies dict
print(response.history)       # List of redirect responses

# Response methods
data = response.json()        # Parse response as JSON
response.raise_for_status()   # Raise exception if status_code >= 400

# Iteration (backward compatible)
for line in response:
    print(line)

# Content iteration
for chunk in response.iter_content(chunk_size=1024):
    process(chunk)

for line in response.iter_lines():
    process(line)

# File-like methods (backward compatible)
content = response.read()          # Read all content
line = response.readline()         # Read one line
lines = response.readlines()       # Read all lines
```

### Session Class

Sessions allow you to persist certain parameters across requests:

```python
# Create a session
s = requests.Session()

# Sessions can persist headers, cookies, and params
s.headers.update({'Authorization': 'Bearer token123'})
s.cookies.update({'session': 'abc'})

# All requests made with the session will include these
response1 = s.get('https://api.example.com/user')
response2 = s.get('https://api.example.com/posts')

# You can override session defaults for individual requests
response3 = s.get('https://api.example.com/public',
                 headers={'Authorization': None})

# Session supports all HTTP methods
s.post('https://api.example.com/data', json={'key': 'value'})
s.put('https://api.example.com/update/1', json={'status': 'done'})
s.request('DELETE', 'https://api.example.com/item/1')

# Close session when done
s.close()

# Or use convenience function
session = requests.session()
```

### Exception Classes

The library provides exception classes for error handling:

```python
try:
    response = requests.get('https://api.example.com/data', timeout=5)
    response.raise_for_status()
    data = response.json()
except requests.Timeout:
    print("Request timed out")
except requests.ConnectionError:
    print("Connection failed")
except requests.HTTPError:
    print(f"HTTP error: {response.status_code}")
except requests.RequestException as e:
    print(f"Request failed: {e}")
```

Available exception classes:

- `RequestException` - Base class for all exceptions
- `HTTPError` - HTTP error occurred (4xx, 5xx)
- `ConnectionError` - Connection error
- `Timeout` - Request timeout
- `TooManyRedirects` - Too many redirects

## Mock Data Support

The library maintains full backward compatibility with BlockPy's mocking system:

```python
# When Sk.requestsGet is set, it will be used instead of real HTTP requests
# This allows BlockPy and similar tools to provide mock data for testing

# The Response class can be instantiated directly with mock data
response = requests.Response("Mock data", 200, {"Content-Type": "text/plain"}, "http://example.com")
print(response.text)         # "Mock data"
print(response.status_code)  # 200
print(response.ok)          # True
```

## Known Limitations

1. **DELETE method**: Due to `delete` being a JavaScript reserved word, you cannot use `requests.delete()` directly. Instead, use:

    ```python
    response = requests.request('DELETE', url)
    ```

2. **Keyword arguments**: Some methods like `iter_content()` may not support keyword arguments in the current implementation. Use positional arguments:

    ```python
    # Use this:
    for chunk in response.iter_content(1024):
        process(chunk)

    # Instead of:
    for chunk in response.iter_content(chunk_size=1024):
        process(chunk)
    ```

3. **Real HTTP Requests**: Actual HTTP requests use XMLHttpRequest which is subject to browser CORS policies. Mock data is recommended for educational environments.

## Backward Compatibility

All existing functionality is preserved:

- `requests.get()` and `requests.post()` work exactly as before
- Response iteration, read(), readline(), readlines() unchanged
- Mock data integration via Sk.requestsGet still works
- Existing BlockPy code continues to function

## Examples

### Simple GET Request

```python
import requests

response = requests.get('https://api.github.com/users/python')
print(f"Status: {response.status_code}")
print(f"User: {response.json()['name']}")
```

### POST with JSON

```python
import requests

data = {'title': 'Test', 'body': 'This is a test', 'userId': 1}
response = requests.post('https://jsonplaceholder.typicode.com/posts', json=data)
print(f"Created: {response.json()}")
```

### Session Example

```python
import requests

# Create session with API key
s = requests.Session()
s.headers.update({'X-API-Key': 'your-api-key'})

# Make multiple requests with the same session
users = s.get('https://api.example.com/users').json()
posts = s.get('https://api.example.com/posts').json()

s.close()
```

### Error Handling

```python
import requests

try:
    response = requests.get('https://api.example.com/data', timeout=10)
    response.raise_for_status()  # Raise exception for 4xx/5xx

    if response.ok:
        data = response.json()
        print("Success:", data)

except requests.Timeout:
    print("Request timed out")
except requests.HTTPError:
    print(f"HTTP Error: {response.status_code} - {response.reason}")
except requests.ConnectionError:
    print("Failed to connect to server")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Implementation Notes

- Built on XMLHttpRequest for actual HTTP requests
- Maintains Skulpt's Promise-based async model via Sk.misceval.Suspension
- Compatible with BlockPy's mock data system via Sk.requestsGet hook
- Response class supports both file-like interface and modern requests API
- All HTTP methods properly set request method in XMLHttpRequest

## Contributing

This is part of the BlockPy fork of Skulpt. Contributions should maintain backward compatibility with existing code while adding new features from the standard Python requests library.
