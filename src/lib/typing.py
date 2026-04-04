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

class _OptionalFactory:
    __name__ = "Optional"
    __qualname__ = "Optional"

    def __class_getitem__(cls, arg):
        return Union[arg, type(None)]

Optional = _OptionalFactory

# --- Key change: TypeVar becomes a factory that returns a *type* ---
class _MockTypeVarMeta(type):
    # Optional: nicer repr/debugging; has no semantic effect
    def __repr__(cls):
        return cls.__name__

def TypeVar(name, *args, **kwargs):
    """
    Runtime-no-op mock of typing.TypeVar.

    Returns a fresh (or cached) *type*, so it works with PEP 604 unions:
        T = TypeVar("T")
        int | T
        T | None
    """

    ns = {
        "__module__": __name__,
        "__qualname__": name,
        "_typevar_name": name,
        "_typevar_args": args,
        "_typevar_kwargs": kwargs,
    }
    return _MockTypeVarMeta(name, (), ns)

def overload(func):
    return func

def runtime_checkable(cls):
    return cls

class ParamSpec:
    def __init__(self, name):
        self.name = name

class List(_IndexReturnsSelf):
    pass

class Dict(_IndexReturnsSelf):
    pass

class ClassVar(_IndexReturnsSelf):
    pass

class _GenericAlias(_IndexReturnsSelf):
    pass

class Sequence(_IndexReturnsSelf):
    pass

class NoReturn:
    pass

class Never:
    pass

class Protocol:
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

def cast(typ, val):
    return val
