import ast
import sys
import traceback

try:
    1/0
except ZeroDivisionError as e:
    print(e)
    print(sys.exc_info())
    print(sys.exc_info()[2].tb_frame.f_code.co_filename)

print("------")

try:
    parsed = ast.parse("a a", "syntactically_incorrect.py")
except SyntaxError as e:
    print(e.lineno, e.filename)
    print(e.filename[0])
    print(sys.exc_info())
    x = sys.exc_info()
    print(x[2].tb_frame.f_code.co_filename)
    #tb = sys.exc_info()[2]
    #print("Traceback", tb)
    #print("Traceback Line number", tb.tb_lineno)
    #print("ExtractedFrames", traceback.extract_tb(tb))
    #for frame in traceback.extract_tb(tb):
    #    print("Frame:", frame.filename)
