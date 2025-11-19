import difflib

differ = difflib.HtmlDiff(tabsize=1, wrapcolumn=60)
x = "a = 0\\nc = 7"
y = "b = 7\\nc = 7"
print(differ.make_table(x.splitlines(), y.splitlines(), 'X', 'Y'))
