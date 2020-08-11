from types import ModuleType

turtle = ModuleType('turtle')

class MockTurtle:
    def __init__(self):
        self.calls = []
    def getter(self, key, *args):
        print(">>>", key, args)
        def _fake_call(*args, **kwargs):
            self.calls.append((key, args, kwargs))
            return self._fake_call(args, kwargs)
        return _fake_call
    def _fake_call(self, *args, **kwargs):
        return 0
    #self.calls.append((args, kwargs))


mt = MockTurtle()
setattr(turtle, '__getattr__', mt.getter)

print(turtle.forward(100))

print(mt.calls)