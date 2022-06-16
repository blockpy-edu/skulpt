from dataclasses import dataclass

# Type definition
@dataclass
class Dog:
    name: str
    age: int
    fuzzy: bool

# Instantiation
ada = Dog("Ada", 4, True)
ada2 = Dog("Ada", 4, True)
print(ada == ada2)
babbage = Dog(name="Babbage", age=5, fuzzy=False)
# Access
print(ada.name)
# Update
ada.name = "Ada Bart"
# Function
def sum_dog_years(dogs: list[Dog]) -> int:
    total = 0
    for dog in dogs:
        total += dog.age * 7
    return total
print(sum_dog_years([ada, babbage]))

print(ada.name)
print(ada == ada2)
print(dir(ada))
print(vars(ada))
"""
Downsides:
* Nominal equality makes autograding harder
* Cannot import JSON data without casting (awful when nested)

Upsides:
* Very nice constructor syntax
* Attribute access aligns with Python method access, and Java
"""
