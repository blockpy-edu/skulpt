assert int | str
assert int | None
assert str | int

assert (int | str) == (str | int)

assert (int | int | int) == int

assert (int | str | None) == (str | int | None)

assert (int | str) != (int | str | float)

assert (int | None) == (None | int)

assert list[str] == list[str]

assert list[str] | None

assert (list[str] | dict[int, str]) == (dict[int, str] | list[str])


assert list | dict == dict | list



from typing import Union

assert Union[int, str] == Union[str, int]
# assert Union[int, str, None] == Union[None, str, int]
assert Union[int, int, int] == int
assert Union[int, str] != Union[int, str, float]

assert Union[Union[int, str], Union[int, str]] == Union[int, str]
