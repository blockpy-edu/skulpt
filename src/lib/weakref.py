def ref(*args):
    return lambda: args[0]

WeakSet = set
WeakDictionary = lambda *x: x[0]
WeakKeyDictionary = lambda *x: x[0]
WeakMethod = lambda *x: x[0]
