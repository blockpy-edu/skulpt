from dataclasses import fields, is_dataclass, dataclass
from typing import Any



class TypeFlattener:
    # TODO: Need to handle shared common ancestors, collection types
    # Should also be checking the actual types of things, not just the
    # string representation
    def __init__(self):
        self._types: set[str] = set()

    def add_type(self, representation: dict):
        full_type = representation.get("fullType", representation.get("type", "unknown"))
        self._types.add(full_type)

    def flatten(self) -> tuple[str, list[str]]:
        if len(self._types) == 1:
            return "homogenous", [self._types.pop()]
        elif len(self._types) > 1:
            return "union", sorted(self._types)
        else:
            return "none", []

class RecursiveTypeDescriber:
    def __init__(self) -> None:
        self._seen_ids: set[int] = set()

    def analyze(self, value: Any) -> dict[str, Any]:
        try:
            result = self.analyze_type(value)
            return result
        except Exception as e:
            try:
                return "Oops"
            except Exception as new_e:
                return "Double Oops"
        finally:
            self._seen_ids.clear()

    def analyze_type(self, value, depth = 0):
        obj_id = id(value)
        self._seen_ids.add(obj_id)

        if isinstance(value, (str, int, float, bool, type(None))):
            return {"type": type(value).__name__}
        elif is_dataclass(value):
            return self.analyze_dataclass_type(value, depth)
        elif isinstance(value, list):
            return self.analyze_list_type(value, depth)
        else:
            print(depth * " ", "Leaf: ", type(value).__name__)
            return {"type": type(value).__name__}

    @staticmethod
    def value_type(value: Any) -> str:
        try:
            return value.__class__.__name__
        except Exception:
            return type(value).__name__

    def analyze_list_type(self, value: list, depth) -> dict[str, Any]:
        element_types = set()
        rows: list[dict[str, Any]] = []
        #type_flattener = TypeFlattener()
        the_original_list_id = id(rows)
        print(depth*" ", "Starting list", id(rows))
        for index, item in enumerate(value):
            print(depth*" ", "Analyzing item", index, "to put in", id(rows))
            child_row = self.analyze_type(item, depth+1)
            # type_flattener.add_type(child_row)
            rows.append(child_row)
            print(depth*" ", "Adding to list", id(rows), "the value", child_row)
        the_new_list_id = id(rows)
        print(depth*" ", "End List", id(rows))
        # element_kind, element_type = type_flattener.flatten()
        element_type = "hello"
        return {
            "type": self.value_type(value),
            "elementType": element_type[0],
            "fullType": f"{self.value_type(value)}[{element_type[0]}]",
            "elements": rows,
            "id": id(value),
        }

    def analyze_dataclass_type(self, value: Any, depth) -> dict[str, Any]:
        rows2: list[dict[str, Any]] = []
        the_original_dc_list_id = id(rows2)
        print(depth*" ", "Start Dataclass", value.__class__.__name__, "with list", id(rows2))
        for field in fields(value):
            print(depth*" ", "Analyzing field", field.name, "to put in", id(rows2))
            field_value = getattr(value, field.name)
            print(depth*" ", "Field value obtained, id is", id(rows2))
            field_analysis = self.analyze_type(field_value, depth+1)
            print(depth * " ", "Type analyzed, id is", id(rows2))
            rows2.append({
                "name": field.name,
                "value": field_analysis,
            })
            print(depth * " ", "Appended, id is", id(rows2))
            the_new_dc_list_id = id(rows2)
            # jseval("console.trace()")
            print(depth*" ", "Analyzed field", field.name, "to put in", id(rows2))
        the_new_dc_list_id = id(rows2)
        print(depth*" ", "End Dataclass", value.__class__.__name__, "with list", id(rows2))
        return {
            "type": "dataclass",
            "className": value.__class__.__name__,
            "fields": rows2,
        }

@dataclass
class Item:
    pass
    #name: str
    # price: int
    #stock: int

@dataclass
class State:
    items2: list[Item]
    #bought: list[str]
    #money: int



state = State(
    items2=[
        Item()
        # Item(name="Sword", price=100, stock=5),
        #Item(name="Shield", price=150, stock=2),
    ],
    #bought=[],
    #money=250,
)

analyze_type = RecursiveTypeDescriber().analyze
t = analyze_type(state)

print(t)
print(t["fields"][0]["value"]["type"], "should be list")
assert t["fields"][0]["value"]["type"] == "list"
