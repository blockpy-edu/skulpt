import sys
import traceback


def walk_tb(tb):
    while tb is not None:
        frame = tb.tb_frame

        if frame and hasattr(frame, 'f_line'):
            line = frame.f_line
        else:
            line = None

        line = line or tb.tb_source

        if frame:
            frame.f_line = line
        yield tb.tb_frame, tb.tb_lineno
        tb = tb.tb_next

try:
    raise ValueError("This is a test exception")
except Exception as e:
    result = sys.exc_info()
    tb = traceback.extract_tb(result[2])
    print(tb)
    # tb = e.__traceback__
    for frame, lineno in walk_tb(tb):
        print(f"Frame: {frame}, Line: {lineno}")
    print("Traceback:", traceback.format_exc())