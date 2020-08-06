a = 0


def x():
    print(super)
    print(a)

x()

print(super)

code = compile('super', 'test.py', 'exec')
exec(code, {})

import test_supering