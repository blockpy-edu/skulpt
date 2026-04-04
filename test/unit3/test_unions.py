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


from typing import Optional

assert Optional[int] == Union[int, None]


assert isinstance(5, int) is True
assert isinstance(5, str | int) is True
assert isinstance(5, int | str) is True
assert isinstance(5, Optional[int]) is True
assert isinstance(None, Optional[int]) is True
assert isinstance(5, Union[str, int]) is True
assert isinstance("5", Union[str, int]) is True

assert isinstance(5, str) is False
assert isinstance(None, str) is False
assert isinstance([1,2], int | str) is False
assert isinstance("test", Optional[int]) is False
assert isinstance({1, 2}, Union[str, int]) is False

from typing import TypeVar

T = TypeVar('T')

assert T | int
assert T | str
assert T | None

assert Optional[T]
assert Union[T, int]
assert Union[T, str]
