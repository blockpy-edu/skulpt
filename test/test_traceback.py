import sys

def another_dumb_approach():
    1+""

bad_code = '''
def be_stupid():
    return 1+""
be_stupid()
'''

def win_dumb_prize():
    exec(bad_code, {'wrong': another_dumb_approach})

try:
    win_dumb_prize()
except Exception as e:
    result = sys.exc_info()
    print(result[2])
    print(result[2].tb_lineno)
    import traceback
    print(traceback.extract_tb(result[2]))