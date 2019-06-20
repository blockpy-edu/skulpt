import time
stopwatch = time.time()
def click(phase):
    global stopwatch
    diff = time.time() - stopwatch
    print("Phase {}: {} secs".format(phase, round(diff, 2)))
    stopwatch = time.time()
    
import pedal
click("Imported pedal")

from pedal.source import set_source
click("Imported source")

set_source("a = 0")
click("Set source")

from pedal.tifa import tifa_analysis
click("Imported Tifa")

tifa_analysis()
click("Ran Tifa")

from pedal.cait import parse_program
click("Imported cait")

ast = parse_program()
click("Parsed program")

if ast.find_all("Assign"):
    print(ast.find_all("Assign"))
click("Found assignments")

from pedal.resolvers import simple
click("Imported resolver")

print(simple.resolve())
click("Resolved")