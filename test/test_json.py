import json



assert json.loads('{"key": "value"}') == {"key": "value"}

assert json.dumps({"key": "value"}) == '{\n "key": "value"\n}'

data = {
    "name": "Test",
    "items": [1, 2, 3],
    "details": {"age": 30, "city": "New York"}
}

assert data == json.loads(json.dumps(data))
