
class EmptyParameter:
    pass

class Parameter:
    empty = EmptyParameter()
    def __init__(self, name, default):
        self.name = name
        self.default = default

def signature(function):
    """

    `parameters` is a dictionary
    `name` and `default` are the values
    `co_varnames` and `$defaults`

    :param function:
    :return:
    """
    pass