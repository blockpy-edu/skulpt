import sys
data = {}
c = compile('banana=0 ; banana', "exec_test.py", 'exec')
exec(c, data)
print(data)
c = compile('x = banana', "exec_test.py", 'exec')
exec(c, data)
print(data)
c = compile('name=0 ; name', "exec_test.py", 'exec')
exec(c, data)
print(data)
c = compile('x = name', "exec_test.py", 'exec')
exec(c, data)
print(data)

##############
# Test changing input
d1 = []
d2 = []
def mock_input1(*prompt):
    d1.append("1")
    return 1
def mock_input2(*prompt):
    d2.append("2")
    return 2
first = """
def x():
    return input()
"""
second = "y = x()"
d = {'input': mock_input1}
# First exec, define x
exec(first, d)
exec(second, d)
d['input'] = mock_input2
exec(second, d)
print(d1)
print(d2)

