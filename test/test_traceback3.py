import sys
import traceback

def blue_1():
    return blue_2()

def blue_2():
    return blue_3()

def blue_3():
    pass

def red_1():
    return red_2()

def red_2():
    raise Exception("An error occurred")

def green_1(alpha: int):
    return green_2(alpha + 1)

def green_2(beta: int):
    return green_3(beta + 1)

def green_3(gamma: int):
    return get_line_code()


def testing_function():
    x = [a for a in [1,2,3]]
    blue_1()
    try:
        return red_1()
    except Exception:
        pass
    return green_1(1)


def get_line_code(depth=3):
    # Load in extract_stack, or provide shim for environments without it.
    try:
        from traceback import extract_stack

        trace = extract_stack()
        # Find the first assert_equal line
        for data in trace:
            line, code = data[1], data[3]
            if code.strip().startswith("testing_function"):  # type: ignore
                return line, code
        # If none found, just try jumping up there and see what we can find
        frame = trace[len(trace) - depth]
        line = frame[1]
        code = frame[3]
        return line, code
    except Exception as e:
        print(e)
        # logger.error(f"Error getting line and code: {e}")
        return None, None


line, code = (
    testing_function()
)

print(line, code)
assert line == 62
assert code.strip() == "testing_function"
