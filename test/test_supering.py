from pedal.report import *
from pedal.source import set_source
set_source("from image import Image\ndog = Image(\"http://localhost:8000/images/swimming.gif\")\ndog.flip().show()", "answer.py")
from pedal.tifa import tifa_analysis
tifa_analysis(False)
from pedal.sandbox.sandbox import Sandbox
from pedal.sandbox import compatibility
#from utility import *
student = MAIN_REPORT['sandbox']['run'] = Sandbox()
#student.run(MAIN_REPORT['source']['code'], MAIN_REPORT['source']['filename'], report_exceptions=False)
#debug(student)
student.report_exceptions_mode = True
#log(get_model_info('execution.input'))

print("Imported", super)