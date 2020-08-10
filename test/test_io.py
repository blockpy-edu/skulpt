import io
from unittest.mock import patch

def haha(*args, **kwargs):
    print("TEST")
    return 'haha'

overridden_modules = {
    '__builtins__': {
        'input': haha
    }
}

s = patch.dict('sys.modules', overridden_modules)
s.start()
d = {'input': haha}
c = compile('print(input())', "test.py", 'exec')
exec(c, d)
s.stop()
print(d)