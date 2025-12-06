import inspect

def test_function(x: dict) -> dict:
    return x


sig = inspect.signature(test_function)
print(sig)

print(sig.parameters['x'].annotation)
