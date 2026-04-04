'''
Returns a dictionary with at least the fields: name, type, value

Value is always able to be a single or nested Representation

String/Integer/Boolean/None primitive: Value and Type boxes

List[Primitive]: Two column, value and type. Value is a set of rows.
Dict[T, Primitive]: Three columns: (Key, Value) in rows, then type column
Class[Primitives]: Three columns: (Field, Value, Type) in rows
Dict[Any, Any]: Four columns: (Key, Key Type, Value, Value Type) in rows

List[Union]:  Need to show type per item

- [X] Primitive types: str, int, float, bool, None
- [X] Homogenous Composite types: list, dict, set, tuple
- [+] Heterogenous Dataclass types: dataclass, class, namedtuple, dict, TypedDict
    - [ ] namedtuple
    - [ ] TypedDict
    - [ ] class (non-dataclass)
- [*] Recursive Types: Linked List, Tree Node, Graph Node
- [ ] Type Unions: Optional, Union
- [ ] Images (PIL): PIL.Image.Image
- [ ] Files: pathlib.Path, io.StringIO, io.BytesIO, DrafterFile
- [ ] Drafter components: Drafter-specific types with custom reprs
- [ ] Binary data: bytes, bytearray
- [ ] Functions/Methods: function, method, lambda
- [ ] Iterator/Generators: iterator, generator, range, enumerate
- [ ] Meta types: type, module
- [ ] Literal Types: Literal
- [ ] Special Types: Any, Never
- [ ] Exceptions: Exception, BaseException

Also measure complexity to provide meaningful explanations to students.
(Could be used as a heuristic for when to trigger IndexDB storage of state snapshots.)

When rendering large lists, only show the first N and last N items, with an ellipsis in between.

Examples:

Primitives:
    str: "Hello World"
    int: 42
    float: 3.14

List of Primitives:
    list[str]: ["apple", "banana", "cherry"]
    list[int]: [1, 2, 3, 4, 5]

2D List of Primitives: Try to show as a table
    list[list[int]]: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ]


List of Unions:
    list[str | int]: [ ("apple", str), (42, int), ("banana", str) ]

Dataclass with Primitives:
    Dog
    [name, str, "Fido"]
    [age, int, 5]
    [is_good, bool, True]

List of Dataclasses:
    list[Dog]: [
        [name, str, "Fido"], [age, int, 5], [is_good, bool, True]
        [name, str, "Rex"], [age, int, 3], [is_good, bool, False]
        [name, str, "Spot"], [age, int, 4], [is_good, bool, True]
    ],

'''

from dataclasses import fields, is_dataclass, dataclass
from typing import Any


def first_shared_base(cls1, cls2):
    """
    Return the first shared base class in the MRO of obj1 and obj2.
    """
    mro1 = cls1.__mro__
    mro2 = cls2.__mro__

    for cls in mro1:
        if cls in mro2:
            return cls

    return None


# Adding a list of dogs
# Then adding a list of cats


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
    """
    Utility to describe nested Python structures as nested representations.
    """

    def __init__(self, *, max_depth: int = 5) -> None:
        self.max_depth: int = max_depth
        self._seen_ids: set[int] = set()

    def analyze(self, value: Any) -> dict[str, Any]:
        try:
            result = self._walk(value, 0)
            return result
        except Exception as e:
            try:
                return self._visit_error(value, e)
            except Exception as new_e:
                return self._visit_complete_failure(value, e, new_e)
        finally:
            self._seen_ids.clear()

    @staticmethod
    def value_type(value: Any) -> str:
        try:
            return value.__class__.__name__
        except Exception:
            return type(value).__name__

    def _visit_error(self, value: Any, error: Exception):
        return {
            "kind": "error",
            "error_message": str(error),
            "type": self.value_type(value),
            "value": repr(value),
            "id": id(value),
            "complexity": 0,
        }

    def _visit_complete_failure(self, value: Any, original_error: Exception, new_error: Exception):
        return {
            "kind": "complete_failure",
            "error_message": str(original_error),
            "new_error_message": str(new_error),
            "id": id(value),
            "type": "?",
            "complexity": 0,
        }

    def _visit_primitive(self, value: str | int | float | bool | None):
        return {
            "kind": "primitive",
            "value": value,
            "type": type(value).__name__,
            "id": id(value),
            "complexity": 1,
        }

    def _visit_cycle(self, value: Any):
        return {
            "kind": "cycle_reference",
            "type": self.value_type(value),
            "targetId": id(value),
            "complexity": 100,
        }

    def _visit_past_max_depth(self, value: Any):
        return {
            "kind": "max_depth_reached",
            "type": self.value_type(value),
            "id": id(value),
            "complexity": 1,
        }

    def _visit_class_instance(self, value: Any, is_a_dataclass: bool, depth: int):
        rows: list[dict[str, Any]] = []
        total_complexity = 0
        print(id(rows))
        for f in fields(value):
            row = self._walk(
                getattr(value, f.name),
                depth + 1,
            )
            rows.append({"name": f.name, "value": row})
            total_complexity += row.get("complexity", 0)
            print(value.__class__.__name__, f.name, row, len(rows), id(rows))
        print(rows, id(rows))
        return {
            "kind": "dataclass" if is_a_dataclass else "class",
            "type": value.__class__.__name__,
            "id": id(value),
            "fields": rows,
            "complexity": 10 + total_complexity,
        }

    def _visit_unknown(self, value: Any):
        return {
            "kind": "unknown",
            "type": self.value_type(value),
            "value": repr(value),
            "id": id(value),
            "complexity": 1,
        }

    def _walk(self, value: Any, depth: int) -> dict[str, Any]:
        # Prevent infinite recursion on cyclic refs
        obj_id = id(value)

        if obj_id in self._seen_ids:
            return self._visit_cycle(value)
        self._seen_ids.add(obj_id)

        # Primitive Types
        if isinstance(value, (str, int, float, bool, type(None))):
            return self._visit_primitive(value)

        # Stop at max depth
        if depth > self.max_depth:
            return self._visit_past_max_depth(value)

        # Dataclass expansion
        if is_dataclass(value):
            return self._visit_class_instance(value, True, depth)

        # Tuple expansion
        if isinstance(value, tuple):
            return self._visit_tuple(value, depth)

        # List/Set expansion
        if isinstance(value, (list, set, frozenset)):
            return self._visit_linear_collection(value, depth)

        # Dict expansion
        if isinstance(value, dict):
            return self._visit_dict(value, depth)

        # Primitive or other object: record leaf
        return self._visit_unknown(value)

    def _visit_tuple(self, value: Any, depth: int) -> dict[str, Any]:
        rows: list[dict[str, Any]] = []
        types: list[str] = []
        total_complexity = 0
        for index, item in enumerate(value):
            child_row = self._walk(item, depth + 1)
            types.append(child_row.get("fullType", child_row.get("type", "unknown")))
            rows.append(child_row)
            total_complexity += child_row.get("complexity", 0)
        if not types:
            return {
                "kind": "empty_tuple",
                "type": self.value_type(value),
                "id": id(value),
                "complexity": 10 + total_complexity,
            }
        else:
            return {
                "kind": "tuple",
                "type": "tuple",
                "fullType": f"tuple[{', '.join(types)}]",
                "elements": rows,
                "id": id(value),
                "complexity": 10 + total_complexity,
            }

    def _visit_linear_collection(self, value: Any, depth: int) -> dict[str, Any]:
        rows: list[dict[str, Any]] = []
        type_flattener = TypeFlattener()
        maximum_complexity = 0
        for index, item in enumerate(value):
            child_row = self._walk(item, depth + 1)
            type_flattener.add_type(child_row)
            rows.append(child_row)
            maximum_complexity = max(maximum_complexity, child_row.get("complexity", 0))
        element_kind, element_type = type_flattener.flatten()
        if element_kind == "none":
            return {
                "kind": "empty_linear_collection",
                "type": self.value_type(value),
                "id": id(value),
                "complexity": 10 + maximum_complexity,
            }
        elif element_kind == "homogenous":
            if element_type[0].startswith("list["):
                return {
                    "kind": "homogenous_grid",
                    "type": "list",
                    "elementType": element_type[0],
                    "rows": rows,
                    "fullType": f"list[{element_type[0]}]",
                    "id": id(value),
                    "complexity": 20 + maximum_complexity,
                }
            return {
                "kind": "homogenous_linear_collection",
                "type": self.value_type(value),
                "elementType": element_type[0],
                "fullType": f"{self.value_type(value)}[{element_type[0]}]",
                "elements": rows,
                "id": id(value),
                "complexity": 10 + maximum_complexity,
            }
        elif element_kind == "union":
            flat_type = " | ".join(element_type)
            return {
                "kind": "linear_collection",
                "type": self.value_type(value),
                "elementType": flat_type,
                "fullType": f"{self.value_type(value)}[{flat_type}]",
                "elements": rows,
                "id": id(value),
                "complexity": 10 + maximum_complexity,
            }
        else:
            return self._visit_unknown(value)

    def _visit_dict(self, value: Any, depth: int) -> dict[str, Any]:
        rows: list[dict[str, Any]] = []
        key_type_flattener = TypeFlattener()
        value_type_flattener = TypeFlattener()
        maximum_complexity = 0
        for key, val in value.items():
            child_key_row = self._walk(key, depth + 1)
            child_value_row = self._walk(val, depth + 1)
            key_type_flattener.add_type(child_key_row)
            value_type_flattener.add_type(child_value_row)
            maximum_complexity = max(
                maximum_complexity,
                child_key_row.get("complexity", 0),
                child_value_row.get("complexity", 0),
            )
            rows.append({
                "key": child_key_row,
                "value": child_value_row,
            })
        key_kind, key_types = key_type_flattener.flatten()
        value_kind, value_types = value_type_flattener.flatten()
        if not rows:
            return {
                "kind": "empty_dict",
                "type": self.value_type(value),
                "id": id(value),
                "complexity": 20 + maximum_complexity,
            }
        else:
            flat_keys, flat_values = " | ".join(key_types), " | ".join(value_types)
            return {
                "kind": "dict",
                "type": self.value_type(value),
                "areKeysHomogenous": key_kind == "homogenous",
                "areValuesHomogenous": value_kind == "homogenous",
                "keyType": flat_keys,
                "valueType": flat_values,
                "fullType": f"dict[{flat_keys}, {flat_values}]",
                "entries": rows,
                "id": id(value),
                "complexity": 20 + maximum_complexity,
            }


def analyze_type(value: Any, max_depth: int = 5) -> dict[str, Any]:
    return RecursiveTypeDescriber(max_depth=max_depth).analyze(value)


@dataclass
class Item:
    name: str
    price: int
    stock: int

@dataclass
class State:
    items: list[Item]
    bought: list[str]
    money: int



state = State(
    items=[
        Item(name="Sword", price=100, stock=5),
        Item(name="Shield", price=150, stock=2),
    ],
    bought=["Potion"],
    money=250,
)
t = analyze_type(state)

print(t)
print(t["fields"][0]["value"]["type"], "should be list")
assert t["fields"][0]["value"]["type"] == "list"
assert t == {
    "type": "State",
    "kind": "dataclass",
    "id": id(state),
    "fields": [
        {
            "name": "items",
            "value": {
                "type": "list",
                "kind": "homogenous_linear_collection",
                "elementType": "Item",
                "fullType": "list[Item]",
                "id": id(state.items),
                "elements": [
                    {
                        "type": "Item",
                        "kind": "dataclass",
                        "id": id(state.items[0]),
                        "fields": [
                            {"name": "name", "value": {"type": "str", "kind": "primitive", "value": "Sword", "id": id("Sword"), "complexity": 1}},
                            {"name": "price", "value": {"type": "int", "kind": "primitive", "value": 100, "id": id(100), "complexity": 1}},
                            {"name": "stock", "value": {"type": "int", "kind": "primitive", "value": 5, "id": id(5), "complexity": 1}},
                        ],
                        "complexity": 13,
                    },
                    {
                        "type": "Item",
                        "kind": "dataclass",
                        "id": id(state.items[1]),
                        "fields": [
                            {"name": "name", "value": {"type": "str", "kind": "primitive", "value": "Shield", "id": id("Shield"), "complexity": 1}},
                            {"name": "price", "value": {"type": "int", "kind": "primitive", "value": 150, "id": id(150), "complexity": 1}},
                            {"name": "stock", "value": {"type": "int", "kind": "primitive", "value": 2, "id": id(2), "complexity": 1}},
                        ],
                        "complexity": 13,
                    },
                ],
                "complexity": 23,
            },
        },
        {
            "name": "bought",
            "value": {
                "type": "list",
                "kind": "homogenous_linear_collection",
                "elementType": "str",
                "fullType": "list[str]",
                "id": id(state.bought),
                "elements": [
                    {"type": "str", "kind": "primitive", "value": "Potion", "id": id("Potion"), "complexity": 1},
                ],
                "complexity": 11,
            },
        },
        {
            "name": "money",
            "value": {
                "type": "int",
                "kind": "primitive",
                "value": 250,
                "id": id(250),
                "complexity": 1,
            },
        },
    ],
    "complexity": 45,
}
