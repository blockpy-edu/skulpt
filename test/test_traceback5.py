from traceback import extract_stack
import sys

def get_line_code():
    # Load in extract_stack, or provide shim for environments without it.
    try:
        print(sys._getframe(), sys._getframe().f_back, sys._getframe().f_back.f_back)
        trace = extract_stack()
        print(trace)
        frame = trace[len(trace) - 3]
        line = frame[1]
        code = frame[3]
        return line, code
    except Exception:
        return None, None


def assert_equal(x, y):
    try:
        raise Exception()
    except:
        # print(extract_stack(sys.exc_info()[2].tb_frame))
        return get_line_code()
    #line, code = get_line_code()
    #return line, code
    #data = {"get_line_code": get_line_code,}
    #exec("line, code = get_line_code()", data)
    #return data['line'], data['code']
    #line, code = [get_line_code() for _ in range(1)][0]
    #return line, code


def sort_hand():
    return 5

line, code = assert_equal(sort_hand(), 5)

print(f"Expected line 36, got {line}")
assert line == 36
