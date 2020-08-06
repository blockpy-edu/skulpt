def _dot_lookup(thing, comp, import_path):
    try:
        return getattr(thing, comp)
    except AttributeError:
        __import__(import_path)
        return getattr(thing, comp)


def _importer(target):
    components = target.split('.')
    import_path = components.pop(0)
    thing = __import__(import_path)
    for comp in components:
        import_path += ".%s" % comp
        thing = _dot_lookup(thing, comp, import_path)
    return thing


def rsplit(a_str, sep, howmany):
    broken = a_str.split(sep)
    where = len(broken) - howmany
    if len(broken) == 1:
        return broken
    front, back = broken[:where], broken[where:]
    back.insert(0, sep.join(front))
    return back


def _get_target(target):
    try:
        target, attribute = rsplit(target, '.', 1)
    except (TypeError, ValueError):
        raise TypeError("Need a valid target to patch. You supplied: %r" %
                        (target,))
    getter = lambda: _importer(target)
    return getter, attribute


class Patch:
    def __init__(self, target, new, return_value):
        self.target = target
        self.new = new
        self.return_value = return_value
        self.getter, self.attribute = _get_target(target)
        self.backup = None

    def get_original(self):
        target = self.getter()
        name = self.attribute
        try:
            original = target.__dict__[name]
        except (AttributeError, KeyError):
            original = getattr(target, name, None)
        return original

    def start(self):
        self.backup = self.get_original()
        if self.new:
            new_attr = self.new
        else:
            new_attr = self.return_value
        setattr(self.getter(), self.attribute, new_attr)

    def stop(self):
        setattr(self.getter(), self.attribute, self.backup)
        if self.target == 'sys.modules':
            self.getter().modules['sys'].modules = self.backup


def pass_through(target, new=None, return_value=None):
    return Patch(target, new, return_value)


patch = pass_through
patch.dict = pass_through
