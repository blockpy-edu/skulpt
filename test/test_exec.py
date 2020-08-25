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