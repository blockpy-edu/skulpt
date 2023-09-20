import logging.js_console as js_console

_LOGGERS = {}

class Logger:

    def __init__(self, name):
        self.name = name
        _LOGGERS[name] = self
        self._handlers = []

    def addHandler(self, handler):
        self._handlers.append(handler)

    def debug(self, *args):
        js_console.debug(*args)
    def error(self, *args):
        js_console.error(*args)

    def warning(self, *args):
        js_console.warning(*args)

    def info(self, *args):
        js_console.info(*args)

    def critical(self, *args):
        js_console.critical(*args)

    def log(self, *args):
        js_console.log(*args)

def getLogger(name):
    if name in _LOGGERS:
        return _LOGGERS[name]
    return Logger(name)


class Handler:
    pass

class NullHandler(Handler):
    pass

def basicConfig(*args, **kwargs):
    pass