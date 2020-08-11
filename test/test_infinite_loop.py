import sys
sys.setExecutionLimit(1000)

print("Gonna infinite loop myself, brb.")
try:
    while True:
        pass
except TimeoutError:
    print("Timed it out")

quit = False
while not quit:
    quit = "quit" == input("Type 'quit' to quit.").lower()
    while True:
        print("SECOND EVIL LOOP")
print("Never reached")