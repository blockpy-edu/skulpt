import sys
from pprint import pprint


from pedal.sandbox import Sandbox

student = Sandbox()
student.run("""
def add_together(a, b):
    return -7
""", as_filename='student.py')
#pprint(student.data)
print(student.data)
print(student.output)


from pedal.assertions import assertEqual

#assertEqual(student.data['a'], 2)

assertEqual(student.call("add_together", 2, 2), 4)

from pedal.report import MAIN_REPORT

print(MAIN_REPORT.feedback[0].mistake)