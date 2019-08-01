def WrapFun(banana):
    print("During creation")
    def innerApple(*args):
        print("Before call")
        result = banana(*args)
        print("After call")
        return result
    return innerApple

@WrapFun
@WrapFun
def doPear(a, b):
    return a+b

doPear(1, 2)

def decorator(cls):
    class Wrapper(object):
        def __init__(self, *args):
            self.wrapped = cls(*args)

        def __getattr__(self, name):
            print('Getting the {} of {}'.format(name, self.wrapped))
            return getattr(self.wrapped, name)

    return Wrapper

@decorator
class C(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y


x = C(1,2)
print(x.x)
print(x)
print(type(x))

D = decorator(C)
print(D(4, 3).x)