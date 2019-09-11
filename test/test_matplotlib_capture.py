import sys

from pedal.report import *
from pedal.source import set_source
set_source("""
import matplotlib.pyplot as plt

print("Hello world")
plt.hist([1,2,3])
plt.xlabel("Hello")
plt.show()
""", "answer.py")

from pedal.sandbox.sandbox import Sandbox
from pedal.sandbox import compatibility

student = MAIN_REPORT['sandbox']['run'] = Sandbox()

student.report_exceptions_mode = True
compatibility.run_student(raise_exceptions=False)

print(compatibility.get_output())
print(compatibility.get_plots())

from pedal.resolvers import simple
SUCCESS, SCORE, CATEGORY, LABEL, MESSAGE, DATA, HIDE = simple.resolve()
print(CATEGORY, LABEL, MESSAGE)