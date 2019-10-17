class C(object):
  def __abs__(self):
    return 10
  def __getattribute__(*args):
    print("Class getattribute invoked", (args[1]))
    return object.__getattribute__(*args)

c = C()

print("Implicit lookup")
print(abs(c))
#10


#---------------------------------------



from pedal.report import *

from pedal.source import set_source

print("TEST")

CODE = """
def x():
    print("ALPHA")
    return {'x': 5}
"""

set_source(CODE, "answer.py")

from pedal.assertions import assert_equal
from pedal.sandbox.sandbox import Sandbox
from pedal.sandbox import compatibility

student = MAIN_REPORT['sandbox']['run'] = Sandbox()

compatibility.run_student(raise_exceptions=False)

print("FIRE")

#assert_equal(student.call('x'), 1.5)
y=student.call('x')
print("AAAA")
print(y.keys())
print(y['x'])
print(y['x']+7)
print(7)
print("BBB")
#print(abs(y))
print("CCCC")
print(len(y))