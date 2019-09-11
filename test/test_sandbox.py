import sys
from pprint import pprint


from pedal.sandbox import Sandbox

student = Sandbox()
student.run("""
def add_together(a, b):
    return -7
print(add_together)
""", as_filename='student.py')
#pprint(student.data)
print(student.data)
print(student.output)


from pedal.assertions import assertEqual, phase

#assertEqual(student.data['a'], 2)

result = student.call("add_together", 2, 2)
#as_int = str(result)
#print("Result was:", as_int)
assertEqual(result, 4)

@phase('input_tryit')
def try_it():
    print("Executed")

from pedal.resolvers import simple

print(simple.resolve())


