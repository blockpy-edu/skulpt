import sys
sys.setExecutionLimit(1000)

quit = False
while not quit:
    quit = "quit" == input("Type 'quit' to quit.").lower()
    while True:
        print("SECOND EVIL LOOP")
print("Never reached")