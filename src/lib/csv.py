QUOTE_MINIMAL = 0
QUOTE_ALL = 1
QUOTE_NONNUMERIC = 2
QUOTE_NONE = 3
QUOTE_STRINGS = 4
QUOTE_NOTNULL = 5

class CSVError(Exception):
    pass

class Dialect:
    def __init__(self, delimiter=',', doublequote=True, escapechar=None,
                 lineterminator='\r\n', quotechar='"', quoting=QUOTE_MINIMAL,
                 skipinitialspace=False, strict=False):
        self.delimiter = delimiter
        self.doublequote = doublequote
        self.escapechar = escapechar
        self.lineterminator = lineterminator
        self.quotechar = quotechar
        self.quoting = quoting
        self.skipinitialspace = skipinitialspace
        self.strict = strict

class Reader:
    START_RECORD, START_FIELD, ESCAPED_CHAR, IN_FIELD, IN_QUOTED_FIELD, ESCAPE_IN_QUOTED_FIELD, QUOTE_IN_QUOTED_FIELD, EAT_CRNL, AFTER_ESCAPED_CRNL = [
        "START_RECORD", "START_FIELD", "ESCAPED_CHAR", "IN_FIELD", "IN_QUOTED_FIELD", "ESCAPE_IN_QUOTED_FIELD", "QUOTE_IN_QUOTED_FIELD", "EAT_CRNL", "AFTER_ESCAPED_CRNL"
    ]
    EOL = '\n'
    NOT_SET = -1

    def __init__(self, iterable, dialect=None, **kwargs):
        self.input_iter = iter(iterable)
        self.dialect = dialect if dialect else Dialect(**kwargs)
        self.line_num = 0
        self.state = self.START_RECORD
        self.fields = []
        self.field = []
        self.unquoted_field = False

    def parse_save_field(self):
        quoting = self.dialect.quoting
        if self.unquoted_field and not self.field and (quoting == QUOTE_NOTNULL or quoting == QUOTE_STRINGS):
            field = None
        else:
            field = ''.join(self.field)
            if not field:
                return -1
            if self.unquoted_field and self.field and (quoting == QUOTE_NONNUMERIC or quoting == QUOTE_STRINGS):
                try:
                    field = float(field)
                except ValueError:
                    return -1
        self.fields.append(field)
        self.field = []
        return 0


    def parse_add_char(self, c):
        if len(self.field) >= _field_limit:
            raise CSVError(f"field larger than field limit ({_field_limit})")
        self.field.append(c)
        return 0

    def __iter__(self):
        return self

    def __next__(self):
        self.fields = []
        self.field = []
        self.state = self.START_RECORD
        self.unquoted_field = False
        while True:
            try:
                line = next(self.input_iter)
            except StopIteration as e:
                if self.field or self.state == self.IN_QUOTED_FIELD:
                    if self.dialect.strict:
                        raise CSVError("unexpected end of data")
                    self.parse_save_field()
                raise e
            if not isinstance(line, str):
                raise CSVError(f"iterator should return strings, not {type(line).__name__} (the file should be opened in text mode)")
            self.line_num += 1
            for c in line:
                self.parse_char(c)
            self.parse_char(self.EOL)
            if self.state == self.START_RECORD:
                break
        fields = self.fields
        self.fields = None
        return fields

    def parse_char(self, c):
        if self.state == self.START_RECORD:
            if c == self.EOL:
                return 0
            elif c == '\n' or c == '\r':
                self.state = self.EAT_CRNL
                return 0
            self.state = self.START_FIELD

        if self.state == self.START_FIELD:
            self.unquoted_field = True
            if c == '\n' or c == '\r' or c == self.EOL:
                if self.parse_save_field() < 0:
                    return -1
                self.state = self.START_RECORD if c == self.EOL else self.EAT_CRNL
            elif c == self.dialect.quotechar and self.dialect.quoting != QUOTE_NONE:
                self.unquoted_field = False
                self.state = self.IN_QUOTED_FIELD
            elif c == self.dialect.escapechar:
                self.unquoted_field = False
                self.state = self.ESCAPED_CHAR
            elif c == ' ' and self.dialect.skipinitialspace:
                pass
            elif c == self.dialect.delimiter:
                if self.parse_save_field() < 0:
                    return -1
            else:
                if self.parse_add_char(c) < 0:
                    return -1
                self.state = self.IN_FIELD
        elif self.state == self.ESCAPED_CHAR:
            if c == '\n' or c == '\r':
                if self.parse_add_char(c) < 0:
                    return -1
                self.state = self.AFTER_ESCAPED_CRNL
            else:
                if c == self.EOL:
                    c = '\n'
                if self.parse_add_char(c) < 0:
                    return -1
                self.state = self.IN_FIELD
        elif self.state == self.AFTER_ESCAPED_CRNL:
            if c == self.EOL:
                return 0
            self.state = self.IN_FIELD
        elif self.state == self.IN_FIELD:
            if c == '\n' or c == '\r' or c == self.EOL:
                if self.parse_save_field() < 0:
                    return -1
                self.state = self.START_RECORD if c == self.EOL else self.EAT_CRNL
            elif c == self.dialect.escapechar:
                self.state = self.ESCAPED_CHAR
            elif c == self.dialect.delimiter:
                if self.parse_save_field() < 0:
                    return -1
                self.state = self.START_FIELD
            else:
                if self.parse_add_char(c) < 0:
                    return -1
        elif self.state == self.IN_QUOTED_FIELD:
            if c == self.EOL:
                pass
            elif c == self.dialect.escapechar:
                self.state = self.ESCAPE_IN_QUOTED_FIELD
            elif c == self.dialect.quotechar and self.dialect.quoting != QUOTE_NONE:
                if self.dialect.doublequote:
                    self.state = self.QUOTE_IN_QUOTED_FIELD
                else:
                    self.state = self.IN_FIELD
            else:
                if self.parse_add_char(c) < 0:
                    return -1
        elif self.state == self.ESCAPE_IN_QUOTED_FIELD:
            if c == self.EOL:
                c = '\n'
            if self.parse_add_char(c) < 0:
                return -1
            self.state = self.IN_QUOTED_FIELD
        elif self.state == self.QUOTE_IN_QUOTED_FIELD:
            if self.dialect.quoting != QUOTE_NONE and c == self.dialect.quotechar:
                if self.parse_add_char(c) < 0:
                    return -1
                self.state = self.IN_QUOTED_FIELD
            elif c == self.dialect.delimiter:
                if self.parse_save_field() < 0:
                    return -1
                self.state = self.START_FIELD
            elif c == '\n' or c == '\r' or c == self.EOL:
                if self.parse_save_field() < 0:
                    return -1
                self.state = self.START_RECORD if c == self.EOL else self.EAT_CRNL
            elif not self.dialect.strict:
                if self.parse_add_char(c) < 0:
                    return -1
                self.state = self.IN_FIELD
            else:
                raise CSVError(f"'{self.dialect.delimiter}' expected after '{self.dialect.quotechar}'")
        elif self.state == self.EAT_CRNL:
            if c == '\n' or c == '\r':
                pass
            elif c == self.EOL:
                self.state = self.START_RECORD
            else:
                raise CSVError("new-line character seen in unquoted field - do you need to open the file with newline=''?")
        return 0

class Writer:
    def __init__(self, fileobj, dialect=None, **kwargs):
        self.write = fileobj.write
        self.dialect = dialect if dialect else Dialect(**kwargs)
        self.fields = []

    def writerow(self, row):
        self.fields = row
        line = self.dialect.delimiter.join(
            self._quote_field(field) for field in self.fields
        )
        self.write(line + self.dialect.lineterminator)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

    def _quote_field(self, field):
        if self.dialect.quoting == QUOTE_NONE:
            return field
        if self.dialect.quoting == QUOTE_ALL:
            return self.dialect.quotechar + field + self.dialect.quotechar
        if self.dialect.quoting == QUOTE_MINIMAL:
            if self.dialect.delimiter in field or self.dialect.quotechar in field or '\n' in field or '\r' in field:
                return self.dialect.quotechar + field + self.dialect.quotechar
        if self.dialect.quoting == QUOTE_NONNUMERIC:
            try:
                float(field)
                return field
            except ValueError:
                return self.dialect.quotechar + field + self.dialect.quotechar
        return field

def register_dialect(name, dialect=None, **kwargs):
    if not isinstance(name, str):
        raise CSVError("Dialect name must be a string")
    if not dialect:
        dialect = Dialect(**kwargs)
    globals()[name] = dialect

def unregister_dialect(name):
    if not isinstance(name, str):
        raise CSVError("Dialect name must be a string")
    if name in globals():
        del globals()[name]
    else:
        raise CSVError("Unknown dialect")

def get_dialect(name):
    if not isinstance(name, str):
        raise CSVError("Dialect name must be a string")
    if name in globals():
        return globals()[name]
    else:
        raise CSVError("Unknown dialect")

def list_dialects():
    return [name for name in globals() if isinstance(globals()[name], Dialect)]

def field_size_limit(limit=None):
    global _field_limit
    old_limit = _field_limit
    if limit is not None:
        _field_limit = limit
    return old_limit

_field_limit = 128 * 1024

reader = Reader
writer = Writer

if __name__ == "__main__":
    import io
    csvfile = io.StringIO("1,2,3\n4,5,6\n")
    reader = Reader(csvfile)
    for row in reader:
        print("ROW", row)