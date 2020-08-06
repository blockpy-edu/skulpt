'''
CISC108 Module that includes some basic helper functions such as assert_equal().

Versions:
0.4 - 2020-APR-25, Austin Cory Bart
 + Added new assert_type function
 + Added tests for assert_type
0.3 - 2019-JUL-??, Eleonor Bart
 + Vastly improved unit tests' flexibility
 + Started work on assert_false and assert_true
0.2.1 - 2019-JAN-23, Austin Cory Bart
 + Keep track of tests' counts in student_tests
 + Improve make_type_name for BlockPy compatibility
0.2 - 2019-JAN-02, Modified by Austin Cory Bart
 + Renamed functions to be in line with common Python convention
 + Packaged into an actual library on PyPI, with tests and stuff.
 + Replaced type(X) checks with isinstance
 + Changed string interpolation to .format
 + Extracted out string messages
0.142 - 2014-APR-23, Modified by Jon Leighton
 + Modified success and failure messages to print "SUCCESS" and "FAILURE" at the
   beginning of each result. This makes it much easier to quickly discern the
   outcome visually.
0.141 - 2014-MAR-26, Modified by Jon Leighton
 + Removed unused function print_verbose().
 + Appended text to FAILURE message for incompatible types to indicate that types
   involved can't be compared.
0.14 - 2014-MAR-26, Modified by Andrew Roosen
 + Modified assert_equal() to return False on failure and True on success.
 + Introduced QUITE option to supress output on SUCCESS.
 + Modified FAILURE message for incompatible data types to be consistent with
 + FAILURE message for unequal values.
 + Modified names of internal functions isEqual() and isseqtype() to _is_equal()
   and _is_seq_type(), respectively
0.13 - 2014-MAR-25, Modified by Jon Leighton
 + added elif clause to _is_equal(), to avoid comparing ints and floats to anything
   that is not an int or a float, and to return None in this case. The previous
   comparison tried to subtract these quantities from each other, causing a
   runtime error.
 + Modified assert_equal() to check for _is_equal() returning None, which now
   indicates an attempt to compare unrelated data types. Failure message is
   modified in this case to report the attempt to compare unrelated types.
 + Removed unused global variables fail and success.
 + Added version numbers to Paul Amer's modifications, and bumped version number to
   reflect my modifications.
 + Changed version number to string, to match recommended practice.
0.122 - 2012-APR-17, Modified by Paul Amer
 + removed graphics stuff; just kept assert_equal
0.121 - 2011-SEP-08, Modified by Paul Amer
 +improved success-failure messages
0.12
 + display can be called multiple times
 + assert_equal supports PIL.Image.Image
0.1
 + Initial assert_equal, display, animate, bind
'''
__version__ = '0.2.1'

# Number encapsulates bool, int, float, complex, decimal.Decimal, etc.
try:
    from numbers import Number
except:
    Number = (bool, int, float, complex)

try:
    bytes
except NameError:
    bytes = str

try:
    frozenset()
except:
    frozenset = tuple()


def make_type_name(value):
    try:
        return type(value).__name__
    except Exception:
        return str(type(value))[8:-2]


def get_line_code():
    # Load in extract_stack, or provide shim for environments without it.
    try:
        from traceback import extract_stack
        trace = extract_stack()
        frame = trace[len(trace) - 3]
        line = frame[1]
        code = frame[3]
        return line, code
    except Exception:
        return None, None


def _normalize_string(text):
    '''
    For strings:
    - strips whitespace from each line
    - lower cases
    '''
    # Lowercase
    text = text.lower()
    # Strip whitespace from each line
    lines = text.split("\n")
    lines = [line.strip() for line in lines if line.strip()]
    text = "\n".join(lines)
    # Return result
    return text


# Don't print message from assert_equal on success
QUIET = False

SET_GENERATOR_TYPES = (type({}.keys()), type({}.values()), type({}.items()))

LIST_GENERATOR_TYPES = (type(map(bool, [])), type(filter(bool, [])),
                        type(range(0)), type(reversed([])), type(zip()),
                        type(enumerate([])))

MESSAGE_LINE_CODE = " - [line {line}] {code}"
MESSAGE_UNRELATED_TYPES = (
    "FAILURE{context}, predicted answer was {y} ({y_type!r}), "
    "computed answer was {x} ({x_type!r}). "
    "You attempted to compare unrelated data types.")
MESSAGE_GENERIC_FAILURE = (
    "FAILURE{context}, predicted answer was {y}, "
    "computed answer was {x}.")
MESSAGE_GENERIC_SUCCESS = (
    "TEST PASSED{context}")


class StudentTestReport:
    def __init__(self):
        self.reset()

    def __repr__(self):
        return str(self)

    def __str__(self):
        return ('<failures={failures}'
                ',successes={successes}'
                ',tests={tests},lines={lines}>'
                ).format(
            failures=self.failures, successes=self.successes, tests=self.tests,
            lines=', '.join(self.lines)
        )

    def reset(self):
        self.failures = 0
        self.successes = 0
        self.tests = 0
        self.lines = []


student_tests = StudentTestReport()


def assert_equal(x, y, precision=4, exact_strings=False, *args) -> bool:
    """
    Checks an expected value using the _is_equal function.
    Prints a message if the test case passed or failed.

    Args:
        x (Any): Any kind of python value. Should have been computed by
            the students' code (their actual answer).
        y (Any): Any kind of python value. The expected value to be produced,
            precalculated (their expected answer).
        precision (int): Optional. Indicates how many decimal places to use
            when comparing floating point values.
        exact_strings (bool): Whether or not strings should be matched perfectly
            character-by-character, or if you should ignore capitalization,
            whitespace, and symbols.
    Returns:
        bool: Whether or not the assertion passed.
    """

    # Can we add in the line number and code?
    line, code = get_line_code()
    if None in (line, code):
        context = ""
    else:
        context = MESSAGE_LINE_CODE.format(line=line, code=code)
        student_tests.lines.append(line)

    result = _is_equal(x, y, precision, exact_strings, *args)
    student_tests.tests += 1
    if result is None:
        student_tests.failures += 1
        print(MESSAGE_UNRELATED_TYPES.format(context=context,
                                             x=repr(x), x_type=make_type_name(x),
                                             y=repr(y), y_type=make_type_name(y)))
        return False
    elif not result:
        student_tests.failures += 1
        print(MESSAGE_GENERIC_FAILURE.format(context=context, x=repr(x), y=repr(y)))
        return False
    elif not QUIET:
        print(MESSAGE_GENERIC_SUCCESS.format(context=context))
    student_tests.successes += 1
    return True


# Hack to allow anyone with an assert_equal reference to get the results
#   since they are global across all calls. Weird strategy!
assert_equal.student_tests = student_tests


def _is_equal(x, y, precision, exact_strings, *args):
    """
    _is_equal : thing thing -> boolean
    _is_equal : number number number -> boolean
    Determines whether the two arguments are equal, or in the case of
    floating point numbers, within a specified number of decimal points
    precision (by default, checks to with 4 decimal points for floating
    point numbers). Returns None when attempting to compare ints and floats
    to anything other than ints and floats.

    Examples:
    >>> _is_equal('ab', 'a'+'b')
     True

    >>> _is_equal(12.34, 12.35)
     False

    >>> _is_equal(12.3456, 12.34568, 4)
     True

    >>> _is_equal(12.3456, 12.34568w5)
     False
    """

    # Check if generators
    if isinstance(x, LIST_GENERATOR_TYPES):
        x = list(x)
    elif isinstance(x, SET_GENERATOR_TYPES):
        x = set(x)
    if isinstance(y, LIST_GENERATOR_TYPES):
        y = list(y)
    elif isinstance(y, SET_GENERATOR_TYPES):
        y = set(y)

    if isinstance(x, float) and isinstance(y, float):
        error = 10 ** (-precision)
        return abs(x - y) < error
    elif isinstance(x, Number) and isinstance(y, Number) and isinstance(x, type(y)):
        return x == y
    elif ((isinstance(x, str) and isinstance(y, str)) or
          (isinstance(x, bytes) and isinstance(y, bytes))):
        if exact_strings:
            return x == y
        else:
            return _normalize_string(x) == _normalize_string(y)
    elif isinstance(x, list) and isinstance(y, list):
        return _are_sequences_equal(x, y, precision, exact_strings)
    elif isinstance(x, tuple) and isinstance(y, tuple):
        return _are_sequences_equal(x, y, precision, exact_strings)
    elif isinstance(x, set) and isinstance(y, set):
        return _are_sets_equal(x, y, precision, exact_strings)
    elif isinstance(x, frozenset) and isinstance(y, frozenset):
        return _are_sets_equal(x, y, precision, exact_strings)
    elif isinstance(x, dict) and isinstance(y, dict):
        primary_keys = set(x.keys())
        if not _are_sets_equal(primary_keys, set(y.keys()),
                               precision, exact_strings):
            return False
        for key in primary_keys:
            if not _is_equal(x[key], y[key], precision, exact_strings):
                return False
        return True
    elif not isinstance(x, type(y)):
        return None
    else:
        return x == y


def _are_sequences_equal(x, y, precision, exact_strings):
    '''
    For sequences that support __len__, __iter__, and should have the same
    order.
    '''
    if len(x) != len(y):
        return False
    for x_element, y_element in zip(x, y):
        if not _is_equal(x_element, y_element, precision, exact_strings):
            return False
    return True


def _set_contains(needle, haystack, precision, exact_strings):
    '''
    Tests if the given needle is one of the elements of haystack, using
    the _is_equal function.
    '''
    for element in haystack:
        if _is_equal(element, needle, precision, exact_strings):
            return True
    return False


def _are_sets_equal(x, y, precision, exact_strings):
    '''
    For sequences that support __len__, __iter__, but order does not matter.
    '''
    if len(x) != len(y):
        return False
    for x_element in x:
        if not _set_contains(x_element, y, precision, exact_strings):
            return False
    return True


################################################################################
# Truthiness stuff

def assert_true(x) -> bool:
    """
    Checks an expected value using the _is_true function.
    Prints a message if the test case passed or failed.

    Args:
        x (Any): Any kind of python value. Should have been computed by
            the students' code (their actual answer).
    Returns:
        bool: Whether or not the assertion passed.
    """
    line, code = get_line_code()
    if None in (line, code):
        context = ""
    else:
        context = MESSAGE_LINE_CODE.format(line=line, code=code)

    result = _is_true(x)
    if result is None:
        print(MESSAGE_UNRELATED_TYPES.format(context=context,
                                             x=x, x_type=type(x).__name__,
                                             y=True, y_type=type(True).__name__))
        return False
    elif not result:
        print(MESSAGE_GENERIC_FAILURE.format(context=context, x=x, y=True))
        return False
    elif not QUIET:
        print(MESSAGE_GENERIC_SUCCESS.format(context=context))
    return True


def assert_false(x) -> bool:
    """
    Checks an expected value using the _is_true function.
    Prints a message if the test case passed or failed.

    Args:
        x (Any): Any kind of python value. Should have been computed by
            the students' code (their actual answer).
    Returns:
        bool: Whether or not the assertion passed.
    """
    line, code = get_line_code()
    if None in (line, code):
        context = ""
    else:
        context = MESSAGE_LINE_CODE.format(line=line, code=code)

    result = _is_true(x)
    if result is None:
        print(MESSAGE_UNRELATED_TYPES.format(context=context,
                                             x=x, x_type=type(x).__name__,
                                             y=False, y_type=type(False).__name__))
        return False
    elif result:
        print(MESSAGE_GENERIC_FAILURE.format(context=context, x=x, y=False))
        return False
    elif not QUIET:
        print(MESSAGE_GENERIC_SUCCESS.format(context=context))
    return True


def _is_true(x):
    """
    _is_true : thing -> boolean
    _is_true : number -> boolean
    Determines whether the argument is true.
    Returns None when attempting to assert a non-boolean

    Examples:
    >>> _is_true(True)
     False

    >>> _is_true("hi")
     None

    >>> _is_true(False)
     False
    """

    if not isinstance(x, bool):
        return None
    else:
        return x


################################################################################
# Type Checking

BETTER_TYPE_NAMES = {
    str: 'string',
    int: 'integer',
    float: 'float',
    bool: 'boolean',
    dict: 'dictionary',
    list: 'list'
}


def _get_name(value):
    try:
        return BETTER_TYPE_NAMES.get(value, value.__name__)
    except Exception:
        return str(value)[8:-2]


def _make_key_list(values):
    if not values:
        return "and there were no keys at all"
    elif len(values) == 1:
        return "but there was the key {!r}".format(values[0])
    else:
        return "but there were the keys " + (", ".join(sorted(map(repr, values[:-1])))) + " and {!r}".format(values[-1])


WRONG_TYPE_MESSAGE = " was the wrong type. Expected type was {y_type!r}, but actual value was {x} ({x_type!r})."
WRONG_KEY_TYPE_MESSAGE = " had a wrong type for a key. Expected type of all keys was {y_type!r}, but there was the key {x} ({x_type!r})."
MISSING_KEY_MESSAGE = " was missing the key {!r}, {}."
EXTRA_KEYS_MESSAGE = " had all the correct keys ({}), but also had these unexpected keys: {}"
NOT_A_TYPE_MESSAGE = " was the value {x!r} ({x_type!r}). However, that's not important because the expected type ({y}) doesn't make sense! The type definition should not have literal values like {y} in it, only types (like {y_type}). The literal values go into instances of the type."


def _validate_dictionary_type(value, expected_type, path):
    if not isinstance(value, dict):
        return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)), y_type="dictionary")
    for expected_key, expected_value in expected_type.items():
        if isinstance(expected_key, str):
            if expected_key not in value:
                return path + MISSING_KEY_MESSAGE.format(expected_key, _make_key_list(list(value.keys())))
            reason = _validate_type(value[expected_key], expected_value,
                                    path + "[{!r}]".format(expected_key))
            if reason:
                return reason
        elif isinstance(expected_key, type):
            for k, v in value.items():
                new_path = path + "[{!r}]".format(k)
                if not isinstance(k, expected_key):
                    return path + WRONG_KEY_TYPE_MESSAGE.format(x=repr(k), x_type=_get_name(type(k)),
                                                                y_type=_get_name(expected_key))
                reason = _validate_type(v, expected_value, new_path)
                if reason:
                    return reason
            break  # only support one key/value type in Lookup style
    else:
        if len(expected_type) != len(value):
            unexpected_keys = set(value.keys()) - set(expected_type.keys())
            unexpected_keys = ", ".join(sorted(map(repr, unexpected_keys)))
            expected_keys = ", ".join(sorted(map(repr, expected_type)))
            return path + EXTRA_KEYS_MESSAGE.format(expected_keys, unexpected_keys)


SIMPLE_TYPES = (int, float, bool, str)


def _validate_type(value, expected_type, path="world"):
    if isinstance(expected_type, dict):
        return _validate_dictionary_type(value, expected_type, path)
    elif isinstance(expected_type, list):
        if not isinstance(value, list):
            return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)), y_type="list")
        if not expected_type and value:
            return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)), y_type="empty list")
        for index, element in enumerate(value):
            reason = _validate_type(element, expected_type[0], path + "[{}]".format(index))
            if reason:
                return reason
    elif isinstance(expected_type, SIMPLE_TYPES):
        return path + NOT_A_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)), y=repr(expected_type),
                                                y_type=type(expected_type).__name__)
    elif expected_type == float:
        if not isinstance(value, (int, float)) and value is not None:
            return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)),
                                                    y_type=_get_name(expected_type))
    elif isinstance(value, bool) and expected_type != bool:
        return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)),
                                                y_type=_get_name(expected_type))
    elif not isinstance(value, expected_type) and value is not None:
        return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)),
                                                y_type=_get_name(expected_type))
    elif value == None and expected_type != None:
        return path + WRONG_TYPE_MESSAGE.format(x=repr(value), x_type=_get_name(type(value)),
                                                y_type=_get_name(expected_type))


def assert_type(value, expected_type) -> bool:
    """
    Checks that the given value is of the expected_type.
    
    Args:
        value (Any): Any kind of python value. Should have been computed by
            the students' code (their actual answer).
        expected_type (type): Any kind of type value. Should be in the format
            used within CISC108. This includes support for literal composite
            types (e.g., [int] and {str: int}) and record types.
    Returns:
        bool: Whether or not the assertion passed.
    """
    # Can we add in the line number and code?
    line, code = get_line_code()
    if None in (line, code):
        context = ""
    else:
        context = MESSAGE_LINE_CODE.format(line=line, code=code)
        student_tests.lines.append(line)

    reason = _validate_type(value, expected_type, "value")
    student_tests.tests += 1
    if reason is not None:
        student_tests.failures += 1
        if isinstance(expected_type, dict):
            if isinstance(value, dict):
                reason = "the " + reason
            else:
                reason = "the " + reason
        print("FAILURE{context},".format(context=context), reason)
        return False
    elif not QUIET:
        print(MESSAGE_GENERIC_SUCCESS.format(context=context))
    student_tests.successes += 1
    return True
