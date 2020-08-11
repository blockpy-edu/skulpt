import io
from unittest.mock import patch

def haha(*args, **kwargs):
    print("TEST")
    return 'haha'

class MockTurtle:
    def forward(self, amount):
        print("MOVING ONWARD:", amount)

overridden_modules = {
    '__builtins__': {
        'input': haha
    },
    'turtle': MockTurtle()
}

s = patch.dict('sys.modules', overridden_modules)
s.start()
d = {'input': haha}
c = compile('print(input())', "test.py", 'exec')
s.stop()
print(d)

s.start()
exec(c, d)
c = compile('import turtle\nprint(turtle.forward(10))', "test2.py", 'exec')
exec(c, d)
s.stop()
print(d)

try:
    import turtle
except e:
    print(e)