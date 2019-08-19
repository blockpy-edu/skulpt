import re

exp_match = re.compile("__.*__")
print(exp_match)
assert exp_match.match("__expr__") is not None