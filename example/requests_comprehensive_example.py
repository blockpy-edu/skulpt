"""
Comprehensive Example: Skulpt Requests Library
Demonstrates all major features of the enhanced requests library
"""
import requests

print("=" * 80)
print("SKULPT REQUESTS LIBRARY - COMPREHENSIVE EXAMPLE")
print("=" * 80)

# =============================================================================
# EXAMPLE 1: Basic GET Request
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 1: Basic GET Request")
print("=" * 80)

# Note: Using mock data for demonstration since actual HTTP requests
# may fail due to CORS in browser environment
mock_response = requests.Response(
    '{"name": "Python", "type": "programming language"}',
    200,
    {"Content-Type": "application/json"},
    "https://api.example.com/languages/python"
)

print(f"URL: {mock_response.url}")
print(f"Status Code: {mock_response.status_code}")
print(f"OK: {mock_response.ok}")
print(f"Reason: {mock_response.reason}")
print(f"Headers: {mock_response.headers}")
print(f"Text: {mock_response.text}")
print(f"JSON: {mock_response.json()}")

# =============================================================================
# EXAMPLE 2: Request with Parameters
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 2: Request with Parameters")
print("=" * 80)

# Demonstrates how params would be used (in actual usage)
print("Example code:")
print("  response = requests.get('https://api.example.com/search',")
print("                         params={'q': 'python', 'limit': 10})")
print("\nThis would request: https://api.example.com/search?q=python&limit=10")

# =============================================================================
# EXAMPLE 3: POST Request with JSON
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 3: POST Request with JSON")
print("=" * 80)

print("Example code:")
print("  data = {'username': 'john', 'email': 'john@example.com'}")
print("  response = requests.post('https://api.example.com/users', json=data)")
print("\nThis automatically sets Content-Type: application/json")

# Mock POST response
post_response = requests.Response(
    '{"id": 123, "username": "john", "status": "created"}',
    201,
    {"Content-Type": "application/json"},
    "https://api.example.com/users"
)
print(f"\nMock Response:")
print(f"  Status: {post_response.status_code} {post_response.reason}")
print(f"  Created User: {post_response.json()}")

# =============================================================================
# EXAMPLE 4: Response Attributes
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 4: Response Attributes")
print("=" * 80)

response = requests.Response(
    "Sample content\nWith multiple lines\nFor demonstration",
    200,
    {"Server": "nginx", "Content-Type": "text/plain"},
    "https://api.example.com/sample"
)

print("Available Response Attributes:")
print(f"  text: {repr(response.text[:30])}...")
print(f"  content: {repr(response.content[:30])}...")
print(f"  status_code: {response.status_code}")
print(f"  ok: {response.ok}")
print(f"  reason: {response.reason}")
print(f"  url: {response.url}")
print(f"  encoding: {response.encoding}")
print(f"  headers: {response.headers}")
print(f"  cookies: {response.cookies}")
print(f"  history: {response.history}")

# =============================================================================
# EXAMPLE 5: Response Methods
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 5: Response Methods")
print("=" * 80)

# Test iteration
print("Iteration (for line in response):")
response_iter = requests.Response("Line 1\nLine 2\nLine 3\n")
for i, line in enumerate(response_iter, 1):
    print(f"  Line {i}: {line.strip()}")

# Test read methods
response_read = requests.Response("Hello\nWorld\nFrom\nSkulpt\n")
print("\nFile-like methods:")
print(f"  readline(): {response_read.readline().strip()}")

response_readlines = requests.Response("Hello\nWorld\nFrom\nSkulpt\n")
lines = response_readlines.readlines()
print(f"  readlines(): {len(lines)} lines")

response_read_all = requests.Response("Complete content")
print(f"  read(): {len(response_read_all.read())} characters")

# Test iter_lines
print("\niter_lines():")
response_iter_lines = requests.Response("Alpha\nBeta\nGamma")
for line in response_iter_lines.iter_lines():
    print(f"  - {line}")

# =============================================================================
# EXAMPLE 6: Error Handling with raise_for_status
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 6: Error Handling")
print("=" * 80)

# Successful response (200)
success_response = requests.Response("Success!", 200)
try:
    success_response.raise_for_status()
    print("✓ Status 200 - No exception raised")
except Exception as e:
    print(f"✗ Unexpected exception: {e}")

# Error response (404)
error_response = requests.Response("Not Found", 404)
try:
    error_response.raise_for_status()
    print("✗ Status 404 - Should have raised exception")
except Exception as e:
    print(f"✓ Status 404 - Exception raised: {e}")

# Server error (500)
server_error = requests.Response("Internal Error", 500)
try:
    server_error.raise_for_status()
    print("✗ Status 500 - Should have raised exception")
except Exception as e:
    print(f"✓ Status 500 - Exception raised")

# =============================================================================
# EXAMPLE 7: Session Usage
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 7: Session Usage")
print("=" * 80)

print("Creating session:")
s = requests.Session()
print(f"  Session created: {s}")

print("\nSession methods available:")
session_methods = ['get', 'post', 'put', 'head', 'options', 'patch', 'request', 'close']
for method in session_methods:
    has_it = hasattr(s, method)
    print(f"  {method}(): {'✓' if has_it else '✗'}")

print("\nSession can persist headers, cookies, and params across requests")
print("  s.headers.update({'Authorization': 'Bearer token'})")
print("  response1 = s.get('https://api.example.com/user')")
print("  response2 = s.get('https://api.example.com/posts')")
print("  # Both requests include the Authorization header")

s.close()
print("  Session closed")

# =============================================================================
# EXAMPLE 8: All HTTP Methods
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 8: All HTTP Methods")
print("=" * 80)

print("Available HTTP methods:")
print("  ✓ requests.get(url)")
print("  ✓ requests.post(url)")
print("  ✓ requests.put(url)")
print("  ✓ requests.head(url)")
print("  ✓ requests.options(url)")
print("  ✓ requests.patch(url)")
print("  ✓ requests.request(method, url)")
print("  ℹ requests.delete unavailable (use requests.request('DELETE', url))")

# =============================================================================
# EXAMPLE 9: Exception Classes
# =============================================================================
print("\n" + "=" * 80)
print("EXAMPLE 9: Exception Classes")
print("=" * 80)

print("Available exception classes:")
exceptions = ['RequestException', 'HTTPError', 'ConnectionError', 'Timeout', 'TooManyRedirects']
for exc in exceptions:
    print(f"  ✓ requests.{exc}")

print("\nExample error handling:")
print("  try:")
print("      response = requests.get(url, timeout=10)")
print("      response.raise_for_status()")
print("      data = response.json()")
print("  except requests.Timeout:")
print("      print('Request timed out')")
print("  except requests.HTTPError:")
print("      print('HTTP error')")
print("  except requests.ConnectionError:")
print("      print('Connection failed')")

# =============================================================================
# SUMMARY
# =============================================================================
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print("""
The Skulpt requests library now includes:

✓ All major HTTP methods (GET, POST, PUT, PATCH, HEAD, OPTIONS, DELETE*)
✓ Full Response object with status_code, headers, url, ok, reason, etc.
✓ Response methods: json(), raise_for_status(), iter_content(), iter_lines()
✓ Request parameters: params, data, json, headers, cookies, timeout
✓ Session class for persistent parameters
✓ Exception classes for error handling
✓ Full backward compatibility with existing code
✓ Mock data support for educational environments

* DELETE available via requests.request('DELETE', url) due to JS reserved word

This implementation provides a feature-rich HTTP library suitable for
educational purposes and compatible with BlockPy's mocking system.
""")

print("=" * 80)
print("EXAMPLE COMPLETED SUCCESSFULLY")
print("=" * 80)
