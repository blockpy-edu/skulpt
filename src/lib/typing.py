TYPE_CHECKING = False

class Self:
    pass

class _IndexReturnsSelf:
    def __class_getitem__(self, key):
        return self

class Any:
    pass

# class Optional(_IndexReturnsSelf):
#     pass

# class Union(_IndexReturnsSelf):
#     pass
class _UnionFactory:
    __name__ = "Union"
    __qualname__ = "Union"

    def __class_getitem__(cls, args):
        if not args:
            return cls
        if not isinstance(args, tuple):
            args = (args,)
        start = args[0]
        for arg in args[1:]:
            start = start | arg
        return start

Union = _UnionFactory
Optional = lambda T: T | None

class List(_IndexReturnsSelf):
    pass

class Dict(_IndexReturnsSelf):
    pass

class ClassVar(_IndexReturnsSelf):
    pass

class _GenericAlias(_IndexReturnsSelf):
    pass

class NoReturn:
    pass

class Never:
    pass

class LiteralString:
    pass

class Literal(_IndexReturnsSelf):
    pass

class TypeAlias:
    pass

class Callable(_IndexReturnsSelf):
    pass

class Tuple(_IndexReturnsSelf):
    pass

class List(_IndexReturnsSelf):
    pass

class Iterator(_IndexReturnsSelf):
    pass
