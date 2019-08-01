import ast

func = ast.parse("def alpha(): pass")

assert func.body[0].name == "alpha"
