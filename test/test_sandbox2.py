import sys

from pedal.report import *
from pedal.source import set_source
set_source("1+''", "answer.py")

from pedal.sandbox.sandbox import Sandbox
from pedal.sandbox import compatibility

student = MAIN_REPORT['sandbox']['run'] = Sandbox()

student.report_exceptions_mode = True
print(len(sys.modules.keys()), sorted(sys.modules.keys()))
old = set(sys.modules.keys())
compatibility.run_student(raise_exceptions=True)

#import pedal.mistakes.instructor_append as ins_app

#print(ins_app)

from pedal.mistakes import instructor_append

new = set(sys.modules.keys())
print(len(sys.modules.keys()), sorted(sys.modules.keys()))

print(new-old)

print(student.output)
print(student.exception_position)

from pedal.resolvers import simple
SUCCESS, SCORE, CATEGORY, LABEL, MESSAGE, DATA, HIDE = simple.resolve()
print(CATEGORY, LABEL, MESSAGE)