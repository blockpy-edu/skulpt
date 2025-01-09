from PIL import Image as PILImage
from drafter import *
from dataclasses import dataclass
import random
import matplotlib.pyplot as plt
from dataclasses import dataclass
from html import escape
import json

print(repr(escape(json.dumps("How's that?"))))

#MatPlotLibPlot.__str__ = plt.savefig

random.seed(0)

MOCK_DATA = [
    random.randint(0, 100) for _ in range(10)
]

plt.hist(MOCK_DATA)
plt.title('Random data')
plt.show()

@dataclass
class State:
    data: list[int]

@route
def index(state: State):
    plt.hist(MOCK_DATA)
    plt.title('Random data')
    return Page(state, [
        "Plotting!",
        Button("How's this working?", second_page),
        MatPlotLibPlot(),
        FileUpload("new_filename"),
        Argument("apple", "banana"),
        Button("Add data", add_data),
        Button("Add Cory's data", add_cory_data,
            Argument("value", random.randint(0, 10))),
    ])

@route
def add_data(state: State, new_filename: bytes, apple: str):
    state.data.append(random.randint(0, 100))
    return index(state)

@route
def second_page(state: State):
    return Page(state, [
        "This is the second page!",
        Button("Go back", index)
    ])

@route
def add_cory_data(state: State, value: int, apple: str, new_filename: bytes):
    state.data.append(value)
    return index(state)


start_server(State(MOCK_DATA))

print(index(State(MOCK_DATA)))