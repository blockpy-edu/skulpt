import sys

def another_dumb_approach():
    1+""

bad_code = '''
def be_stupid():
    return 1+""
be_stupid()
'''

def win_dumb_prize():
    co = compile(bad_code, "my_weird_file.py", 'exec')
    exec(co, {'wrong': another_dumb_approach})

try:
    win_dumb_prize()
except Exception as e:
    print(str(e))
    print(repr(e))
    result = sys.exc_info()
    print("Exception", result[1])
    print("Traceback", result[2])
    print("Traceback Line number", result[2].tb_lineno)
    import traceback
    print("Imported traceback")
    print("ExtractedFrames", traceback.extract_tb(result[2]))