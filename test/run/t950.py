# Test basic match statement functionality
x = 5
match x:
    case 1:
        print("one")
    case 5:
        print("five")
    case _:
        print("default")

# Test string matching
s = "hello"
match s:
    case "hello":
        print("greeting")
    case "world":
        print("planet")
    case _:
        print("unknown")

print("match tests completed")