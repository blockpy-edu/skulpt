import sys
import os

from ast import NodeVisitor, parse
import ast
from textwrap import indent, dedent


class SkulptCompiler(NodeVisitor):
    def __init__(self, module_name, original_lines):
        self.module_name = module_name
        self.original_lines = original_lines
        self.indent = 0
        self.unhandled = set()
        self.result = []
        self.stack = []

    def generic_visit(self, node):
        print(self.indent*" ", type(node).__name__)
        self.unhandled.add(type(node).__name__)
        result = NodeVisitor.generic_visit(self, node)
        return result

    def add_statement(self, line=""):
        self.result.append("    " * self.indent + line)

    def enter(self, name):
        self.indent += 1
        self.stack.append(name)

    def exit(self):
        self.indent -= 1
        self.stack.pop()

    def visit_Module(self, node):
        self.add_statement("var $builtinmodule = function (name) {")
        self.enter("mod")
        self.add_statement("let mod = {{__name__: {name} }};".format(name=self.module_name))
        for statement in node.body:
            try:
                self.visit(statement)
                self.add_statement()
            except Exception as e:
                print("ERROR line {}: {}".format(statement.lineno, self.original_lines[statement.lineno-1]))
                raise e
        self.add_statement("return mod;")
        self.exit()
        self.add_statement("};")

    @property
    def context(self):
        return self.stack[-1]


    def visit_ClassDef(self, node):
        owner = self.context
        self.add_statement(
            "{owner}.{name} = Sk.misceval.buildClass({owner}, function($gbl, $loc) {{".format(
                owner=owner, name=node.name))
        self.enter("$loc")
        for statement in node.body:
            self.visit(statement)
            self.add_statement()
        self.exit()
        bases = ", ".join(self.visit(base) for base in node.bases)
        self.add_statement("}}, '{name}', [{bases}], {{}});".format(
            name=node.name, bases=bases
        ))

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load):
            return node.id
        elif isinstance(node.ctx, ast.Store):
            return "var {name} = {{value}}".format(name=node.id)
        elif isinstance(node.ctx, ast.Del):
            return "delete {name};".format(name=node.id)
        # return "Sk.misceval.loadname('{}', $gbl)".format(node.id)

    def visit_FunctionDef(self, node):
        owner = self.context
        args = ", ".join(arg.arg for arg in node.args.args)
        str_args = ", ".join("'{}'".format(arg.arg) for arg in node.args.args)
        defaults = ", ".join(self.visit(default) for default in node.args.defaults)
        self.add_statement(
            "var {name} = new Sk.builtin.func(function({args}) {{".format(
                name=node.name, args=args))
        self.enter(node.name)
        for statement in node.body:
            self.visit(statement)
        self.exit()
        self.add_statement("}});")
        self.add_statement("{name}.co_varnames = [{args}]".format(
            name=node.name, args=str_args
        ))
        if defaults:
            self.add_statement("{name}.$defaults = [{defaults}]".format(
                name=node.name, defaults=defaults
            ))
        self.add_statement("{owner}.{name} = _{name}".format(
            owner=owner, name=node.name
        ))

    def visit_If(self, node):
        condition = self.visit(node.test)
        self.add_statement("if ({condition}) {{".format(condition=condition))
        self.enter("if")
        for statement in node.body:
            self.visit(statement)
        self.exit()
        self.add_statement("}")

    def visit_Assign(self, node):
        # handle multiple targets
        target = node.targets[0]
        value = self.visit(node.value)
        if type(target).__name__ == 'Attribute':
            self.add_statement(self.visit_Attribute(target).format(value=value))
        elif isinstance(target, ast.Name):
            self.add_statement(self.visit_Name(target).format(value=value)+";")
        elif isinstance(target, ast.Subscript):
            self.add_statement(self.visit_Subscript(target).format(value=value)+";")

    def visit_Str(self, node):
        return repr(node.s)
        #return "new Sk.builtins.str('{}')".format(node.s)

    def visit_Num(self, node):
        return "new Sk.builtin.int_({})".format(node.n)

    def visit_List(self, node):
        return "[" + ", ".join(str(self.visit(elt))
                               for elt in node.elts) + "]"

    def visit_Dict(self, node):
        return "{"+", ".join("{}: {}".format(self.visit(k), self.visit(v))
                             for k,v in zip(node.keys, node.values))+"}"

    def visit_NameConstant(self, node):
        if node.value == True:
            return "true"#"Sk.builtin.bool.true$"
        elif node.value == False:
            return "false"#"Sk.builtin.bool.false$"
        elif node.value == None:
            return "null"#"Sk.builtin.none.none$"

    def visit_Expr(self, node):
        if isinstance(node.value, ast.Str):
            self.add_commented_block(node.value.s)
        else:
            self.add_statement(self.visit(node.value))

    def add_commented_block(self, value):
        self.add_statement("/**"+indent(dedent(value), (self.indent)*"    "))
        self.add_statement("**/")

    def visit_Subscript(self, node):
        if isinstance(node.slice, ast.Index):
            value = self.visit(node.value)
            index = self.visit(node.slice.value)
            if isinstance(node.ctx, ast.Store):
                return "{value}[{index}] = {{value}};".format(value=value, index=index)
            elif isinstance(node.ctx, ast.Load):
                return "{value}[{index}]".format(value=value, index=index)
            elif isinstance(node.ctx, ast.Del):
                return "delete {value}[{index}];".format(value=value, index=index)
        else:
            pass
            # TODO: Slices
        return "BANANA"


    def visit_InternalAttribute(self, node, attr):
        if isinstance(node.ctx, ast.Store):
            return "this.{attr} = {{value}};".format(attr=attr)
        elif isinstance(node.ctx, ast.Load):
            return "this.{attr}".format(attr=attr)
        elif isinstance(node.ctx, ast.Del):
            return "delete this.{attr};".format(attr=attr)

    def visit_Attribute(self, node):
        owner = self.visit(node.value)
        if owner == "self":
            return self.visit_InternalAttribute(node, node.attr)
        attr = "Sk.builtins.str('{}')".format(node.attr)
        if type(node.ctx).__name__ == "Store":
            return "Sk.abstr.sattr({owner}, {attr}, {{value}}, true);".format(
                owner=owner, attr=attr
            )
        elif type(node.ctx).__name__ == "Load":
            return "Sk.abstr.gattr({owner}, {attr}, true)".format(owner=owner, attr=attr)
        else:  # Del
            pass

    def visit_Return(self, node):
        self.add_statement("return {};".format(self.visit(node.value)));

    def visit_ImportFrom(self, node):
        module = node.module
        names = node.names
        self.add_statement("var {module} = Sk.builtin.__import__('{module}', $gbl, $loc, [{names}], -1);".format(
            module=module,
            names=", ".join(repr(name.name) for name in names),
        ))
        for name in names:
            self.add_statement("var {name} = Sk.abstr.gattr({module}, new Sk.builtin.str({name!r}))".format(
                name=name.asname if name.asname else name.name,
                module=module
            ))

    def visit_Call(self, node):
        func = node.func
        # TODO: args
        return "{func}()".format(func=self.visit(func))


if __name__ == '__main__':
    target = sys.argv[1]
    with open(target, 'r') as target_file:
        code = target_file.read()
    parsed = parse(code)
    compiler = SkulptCompiler(sys.argv[2], code.split("\n"))
    compiled = compiler.visit(parsed)
    print("\n".join(compiler.result))
    print("Did not handle:", compiler.unhandled)
