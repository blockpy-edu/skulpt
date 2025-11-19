from dataclasses import dataclass, is_dataclass
import pprint
import unittest

@dataclass
class State:
    count: int
    name: str

@dataclass
class Button:
    text: str
    action: str

@dataclass
class Page:
    state: State
    content: list

class CustomPrettyPrinter(pprint.PrettyPrinter):  # type: ignore
    def format(self, object, context, maxlevels, level):
        return pprint.PrettyPrinter.format(self, object, context, maxlevels, level)

def format_page_content(content, width=80):
    custom_pretty_printer = CustomPrettyPrinter(
        indent=1, width=width
    )
    return custom_pretty_printer.pformat(content)

class TestPprint(unittest.TestCase):
    def test_pprint_list(self):
        data = [1, 2, 3, 4, 5]
        expected_output = "[1, 2, 3, 4, 5]\n"
        actual_output = format_page_content(data)
        self.assertEqual(expected_output.strip(), actual_output)

    def test_pprint_dict(self):
        data = {'a': 1, 'b': 2, 'c': 3}
        expected_output = "{'a': 1, 'b': 2, 'c': 3}\n"
        actual_output = format_page_content(data)
        self.assertEqual(expected_output.strip(), actual_output)


    def test_pprint_nested(self):
        page = Page(State(5, "TestPage"), [
            "Welcome to the test page!",
            Button("Click Me", "do_something")
        ])

        expected_output = (
            "Page(state=State(count=5, name='TestPage'),\n"
            "     content=['Welcome to the test page!',\n"
            "              Button(text='Click Me', action='do_something')])")
        actual_output = format_page_content(page)
        print(actual_output)
        self.assertEqual(expected_output, actual_output)

page = Page(State(5, "TestPage"), [
            "Welcome to the test page!",
            Button("Click Me", "do_something")
        ])
print(is_dataclass(page))
print(format_page_content(page))

if __name__ == '__main__':
    unittest.main()
