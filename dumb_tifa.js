  Import
  alias
    Compare
    Is
var $builtinmodule = function (name) {
    let mod = {__name__: dumb_tifa };
    
    var pprint = Sk.builtin.__import__('pprint', $gbl, $loc, ['pprint'], -1);
    var pprint = Sk.abstr.gattr(pprint, new Sk.builtin.str('pprint'))
    
    var pedal.report = Sk.builtin.__import__('pedal.report', $gbl, $loc, ['MAIN_REPORT'], -1);
    var MAIN_REPORT = Sk.abstr.gattr(pedal.report, new Sk.builtin.str('MAIN_REPORT'))
    
    var pedal.tifa.type_definitions = Sk.builtin.__import__('pedal.tifa.type_definitions', $gbl, $loc, ['UnknownType', 'RecursedType', 'FunctionType', 'ClassType', 'InstanceType', 'NumType', 'NoneType', 'BoolType', 'TupleType', 'ListType', 'StrType', 'GeneratorType', 'DictType', 'ModuleType', 'SetType', 'type_from_json', 'type_to_literal', 'get_tifa_type', 'LiteralNum', 'LiteralBool', 'LiteralNone', 'LiteralStr', 'LiteralTuple'], -1);
    var UnknownType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('UnknownType'))
    var RecursedType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('RecursedType'))
    var FunctionType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('FunctionType'))
    var ClassType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('ClassType'))
    var InstanceType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('InstanceType'))
    var NumType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('NumType'))
    var NoneType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('NoneType'))
    var BoolType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('BoolType'))
    var TupleType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('TupleType'))
    var ListType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('ListType'))
    var StrType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('StrType'))
    var GeneratorType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('GeneratorType'))
    var DictType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('DictType'))
    var ModuleType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('ModuleType'))
    var SetType = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('SetType'))
    var type_from_json = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('type_from_json'))
    var type_to_literal = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('type_to_literal'))
    var get_tifa_type = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('get_tifa_type'))
    var LiteralNum = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('LiteralNum'))
    var LiteralBool = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('LiteralBool'))
    var LiteralNone = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('LiteralNone'))
    var LiteralStr = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('LiteralStr'))
    var LiteralTuple = Sk.abstr.gattr(pedal.tifa.type_definitions, new Sk.builtin.str('LiteralTuple'))
    
    var pedal.tifa.builtin_definitions = Sk.builtin.__import__('pedal.tifa.builtin_definitions', $gbl, $loc, ['get_builtin_module', 'get_builtin_function'], -1);
    var get_builtin_module = Sk.abstr.gattr(pedal.tifa.builtin_definitions, new Sk.builtin.str('get_builtin_module'))
    var get_builtin_function = Sk.abstr.gattr(pedal.tifa.builtin_definitions, new Sk.builtin.str('get_builtin_function'))
    
    var pedal.tifa.type_operations = Sk.builtin.__import__('pedal.tifa.type_operations', $gbl, $loc, ['merge_types', 'are_types_equal', 'VALID_UNARYOP_TYPES', 'VALID_BINOP_TYPES', 'ORDERABLE_TYPES', 'INDEXABLE_TYPES'], -1);
    var merge_types = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('merge_types'))
    var are_types_equal = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('are_types_equal'))
    var VALID_UNARYOP_TYPES = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('VALID_UNARYOP_TYPES'))
    var VALID_BINOP_TYPES = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('VALID_BINOP_TYPES'))
    var ORDERABLE_TYPES = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('ORDERABLE_TYPES'))
    var INDEXABLE_TYPES = Sk.abstr.gattr(pedal.tifa.type_operations, new Sk.builtin.str('INDEXABLE_TYPES'))
    
    var pedal.tifa.identifier = Sk.builtin.__import__('pedal.tifa.identifier', $gbl, $loc, ['Identifier'], -1);
    var Identifier = Sk.abstr.gattr(pedal.tifa.identifier, new Sk.builtin.str('Identifier'))
    
    var pedal.tifa.state = Sk.builtin.__import__('pedal.tifa.state', $gbl, $loc, ['State'], -1);
    var State = Sk.abstr.gattr(pedal.tifa.state, new Sk.builtin.str('State'))
    
    var pedal.tifa.messages = Sk.builtin.__import__('pedal.tifa.messages', $gbl, $loc, ['_format_message'], -1);
    var _format_message = Sk.abstr.gattr(pedal.tifa.messages, new Sk.builtin.str('_format_message'))
    
    var __all__ = ['Tifa'];
    
    mod.Tifa = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        /**
        TIFA Class for traversing an AST and finding common issues.

        Args:
            python_3 (bool): Whether to parse the code in regular PYTHON_3 mode or
                             the modified AST that Skulpt uses.
            report (Report): The report object to store data and feedback in. If
                             left None, defaults to the global MAIN_REPORT.

        **/
        
        var __init__ = new Sk.builtin.func(function(self, python_3, report) {
            if (None) {
                var report = MAIN_REPORT;
            }
            this.report = report;
            this._initialize_report()
        }});
        __init__.co_varnames = ['self', 'python_3', 'report']
        __init__.$defaults = [true, null]
        $loc.__init__ = ___init__
        
        var _initialize_report = new Sk.builtin.func(function(self) {
            /**
            Initialize a successful report with possible set of issues.

            **/
            this.report['tifa'] = {'success': true, 'variables': {}, 'top_level_variables': {}, 'issues': {}};;
        }});
        _initialize_report.co_varnames = ['self']
        $loc._initialize_report = __initialize_report
        
    }, 'Tifa', [Sk.abstr.gattr(ast, Sk.builtins.str('NodeVisitor'), true)], {});
    
    return mod;
};
Did not handle: {'Compare', 'Import', 'alias', 'Is'}
