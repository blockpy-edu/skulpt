#!/usr/bin/env python
"""
Test script to validate missing Python features in Skulpt
This script can be run with: npm start py3 missing_features_test.py
"""

print("=== Testing Missing Python Features in Skulpt ===\n")

# Test 1: f-strings (Python 3.6+)
print("1. Testing f-strings...")
try:
    name = "world"
    # This should fail in Skulpt
    result = f"Hello {name}!"
    print(f"SUCCESS: f-strings work: {result}")
except:
    print("EXPECTED FAIL: f-strings not supported")

print()

# Test 2: Type annotations 
print("2. Testing type annotations...")
try:
    exec("x: int = 5")
    print("SUCCESS: Type annotations work")
except Exception as e:
    print(f"EXPECTED FAIL: Type annotations not supported - {e}")

print()

# Test 3: Set literals
print("3. Testing set literals...")
try:
    s = {1, 2, 3}
    print(f"SUCCESS: Set literals work: {s}")
except Exception as e:
    print(f"FAIL: Set literals not supported - {e}")

print()

# Test 4: Dictionary comprehensions
print("4. Testing dictionary comprehensions...")
try:
    items = [('a', 1), ('b', 2)]
    d = {k: v for k, v in items}
    print(f"SUCCESS: Dict comprehensions work: {d}")
except Exception as e:
    print(f"FAIL: Dict comprehensions not supported - {e}")

print()

# Test 5: Extended unpacking 
print("5. Testing extended unpacking...")
try:
    exec("a, *b, c = [1, 2, 3, 4, 5]")
    print("SUCCESS: Extended unpacking works")
except Exception as e:
    print(f"EXPECTED FAIL: Extended unpacking not supported - {e}")

print()

# Test 6: Missing built-in functions
print("6. Testing missing built-in functions...")

missing_builtins = ['bytearray', 'memoryview', 'vars', 'locals']
for func_name in missing_builtins:
    try:
        func = globals()[func_name]
        if callable(func):
            result = func() if func_name in ['vars', 'locals'] else func([1,2,3])
            print(f"SUCCESS: {func_name} works: {type(result)}")
        else:
            print(f"FAIL: {func_name} not callable")
    except Exception as e:
        print(f"EXPECTED FAIL: {func_name} not implemented - {type(e).__name__}")

print()

# Test 7: Import missing modules
print("7. Testing missing standard library modules...")

test_modules = [
    'pathlib', 'contextlib', 'functools', 'itertools', 
    'collections', 'operator', 'decimal', 'fractions',
    'calendar', 'tempfile', 'shutil', 'glob'
]

working_modules = []
missing_modules = []

for module in test_modules:
    try:
        exec(f"import {module}")
        working_modules.append(module)
        print(f"SUCCESS: {module} imported successfully")
    except Exception as e:
        missing_modules.append(module)
        print(f"FAIL: {module} - {type(e).__name__}: {e}")

print(f"\nSummary:")
print(f"Working modules: {len(working_modules)} - {working_modules}")  
print(f"Missing modules: {len(missing_modules)} - {missing_modules}")

print()

# Test 8: Partial implementations
print("8. Testing partially implemented features...")

# Test complex number formatting
try:
    c = complex(1, 2)
    formatted = format(c, '.2f')
    print(f"SUCCESS: Complex formatting works: {formatted}")
except Exception as e:
    print(f"EXPECTED FAIL: Complex __format__ not implemented - {e}")

# Test dir() with no arguments
try:
    result = dir()
    print(f"SUCCESS: dir() with no args works, returned {len(result)} items")
except Exception as e:
    print(f"EXPECTED FAIL: dir() with no args not supported - {e}")

print("\n=== Test Complete ===")