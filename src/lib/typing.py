TYPE_CHECKING = False

class Self:
    pass

class _IndexReturnsSelf:
    def __class_getitem__(self, key):
        return self

class Any:
    pass

class Optional(_IndexReturnsSelf):
    pass

class Union(_IndexReturnsSelf):
    pass

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