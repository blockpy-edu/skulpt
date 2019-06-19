// generated by pgen/main.py
Sk.OpMap = {
"(": Sk.token.tokens.T_LPAR,
")": Sk.token.tokens.T_RPAR,
"[": Sk.token.tokens.T_LSQB,
"]": Sk.token.tokens.T_RSQB,
":": Sk.token.tokens.T_COLON,
",": Sk.token.tokens.T_COMMA,
";": Sk.token.tokens.T_SEMI,
"+": Sk.token.tokens.T_PLUS,
"-": Sk.token.tokens.T_MINUS,
"*": Sk.token.tokens.T_STAR,
"/": Sk.token.tokens.T_SLASH,
"|": Sk.token.tokens.T_VBAR,
"&": Sk.token.tokens.T_AMPER,
"<": Sk.token.tokens.T_LESS,
">": Sk.token.tokens.T_GREATER,
"=": Sk.token.tokens.T_EQUAL,
".": Sk.token.tokens.T_DOT,
"%": Sk.token.tokens.T_PERCENT,
"`": Sk.token.tokens.T_BACKQUOTE,
"{": Sk.token.tokens.T_LBRACE,
"}": Sk.token.tokens.T_RBRACE,
"@": Sk.token.tokens.T_AT,
"==": Sk.token.tokens.T_EQEQUAL,
"!=": Sk.token.tokens.T_NOTEQUAL,
"<>": Sk.token.tokens.T_NOTEQUAL,
"<=": Sk.token.tokens.T_LESSEQUAL,
">=": Sk.token.tokens.T_GREATEREQUAL,
"~": Sk.token.tokens.T_TILDE,
"^": Sk.token.tokens.T_CIRCUMFLEX,
"<<": Sk.token.tokens.T_LEFTSHIFT,
">>": Sk.token.tokens.T_RIGHTSHIFT,
"**": Sk.token.tokens.T_DOUBLESTAR,
"+=": Sk.token.tokens.T_PLUSEQUAL,
"-=": Sk.token.tokens.T_MINEQUAL,
"*=": Sk.token.tokens.T_STAREQUAL,
"/=": Sk.token.tokens.T_SLASHEQUAL,
"%=": Sk.token.tokens.T_PERCENTEQUAL,
"&=": Sk.token.tokens.T_AMPEREQUAL,
"|=": Sk.token.tokens.T_VBAREQUAL,
"^=": Sk.token.tokens.T_CIRCUMFLEXEQUAL,
"<<=": Sk.token.tokens.T_LEFTSHIFTEQUAL,
">>=": Sk.token.tokens.T_RIGHTSHIFTEQUAL,
"**=": Sk.token.tokens.T_DOUBLESTAREQUAL,
"//": Sk.token.tokens.T_DOUBLESLASH,
"//=": Sk.token.tokens.T_DOUBLESLASHEQUAL,
"->": Sk.token.tokens.T_RARROW
};
Sk.ParseTables = {
sym:
{and_expr: 257,
 and_test: 258,
 annassign: 259,
 arglist: 260,
 argument: 261,
 arith_expr: 262,
 assert_stmt: 263,
 async_funcdef: 264,
 async_stmt: 265,
 atom: 266,
 atom_expr: 267,
 augassign: 268,
 break_stmt: 269,
 classdef: 270,
 comp_for: 271,
 comp_if: 272,
 comp_iter: 273,
 comp_op: 274,
 comparison: 275,
 compound_stmt: 276,
 continue_stmt: 277,
 debugger_stmt: 278,
 decorated: 279,
 decorator: 280,
 decorators: 281,
 del_stmt: 282,
 dictorsetmaker: 283,
 dotted_as_name: 284,
 dotted_as_names: 285,
 dotted_name: 286,
 encoding_decl: 287,
 eval_input: 288,
 except_clause: 289,
 expr: 290,
 expr_stmt: 291,
 exprlist: 292,
 factor: 293,
 file_input: 294,
 flow_stmt: 295,
 for_stmt: 296,
 funcdef: 297,
 global_stmt: 298,
 if_stmt: 299,
 import_as_name: 300,
 import_as_names: 301,
 import_from: 302,
 import_name: 303,
 import_stmt: 304,
 lambdef: 305,
 lambdef_nocond: 306,
 nonlocal_stmt: 307,
 not_test: 308,
 or_test: 309,
 parameters: 310,
 pass_stmt: 311,
 power: 312,
 print_stmt: 313,
 raise_stmt: 314,
 return_stmt: 315,
 shift_expr: 316,
 simple_stmt: 317,
 single_input: 256,
 sliceop: 318,
 small_stmt: 319,
 star_expr: 320,
 stmt: 321,
 subscript: 322,
 subscriptlist: 323,
 suite: 324,
 term: 325,
 test: 326,
 test_nocond: 327,
 testlist: 328,
 testlist_comp: 329,
 testlist_star_expr: 330,
 tfpdef: 331,
 trailer: 332,
 try_stmt: 333,
 typedargslist: 334,
 varargslist: 335,
 vfpdef: 336,
 while_stmt: 337,
 with_item: 338,
 with_stmt: 339,
 xor_expr: 340,
 yield_arg: 341,
 yield_expr: 342,
 yield_stmt: 343},
number2symbol:
{256: 'single_input',
 257: 'and_expr',
 258: 'and_test',
 259: 'annassign',
 260: 'arglist',
 261: 'argument',
 262: 'arith_expr',
 263: 'assert_stmt',
 264: 'async_funcdef',
 265: 'async_stmt',
 266: 'atom',
 267: 'atom_expr',
 268: 'augassign',
 269: 'break_stmt',
 270: 'classdef',
 271: 'comp_for',
 272: 'comp_if',
 273: 'comp_iter',
 274: 'comp_op',
 275: 'comparison',
 276: 'compound_stmt',
 277: 'continue_stmt',
 278: 'debugger_stmt',
 279: 'decorated',
 280: 'decorator',
 281: 'decorators',
 282: 'del_stmt',
 283: 'dictorsetmaker',
 284: 'dotted_as_name',
 285: 'dotted_as_names',
 286: 'dotted_name',
 287: 'encoding_decl',
 288: 'eval_input',
 289: 'except_clause',
 290: 'expr',
 291: 'expr_stmt',
 292: 'exprlist',
 293: 'factor',
 294: 'file_input',
 295: 'flow_stmt',
 296: 'for_stmt',
 297: 'funcdef',
 298: 'global_stmt',
 299: 'if_stmt',
 300: 'import_as_name',
 301: 'import_as_names',
 302: 'import_from',
 303: 'import_name',
 304: 'import_stmt',
 305: 'lambdef',
 306: 'lambdef_nocond',
 307: 'nonlocal_stmt',
 308: 'not_test',
 309: 'or_test',
 310: 'parameters',
 311: 'pass_stmt',
 312: 'power',
 313: 'print_stmt',
 314: 'raise_stmt',
 315: 'return_stmt',
 316: 'shift_expr',
 317: 'simple_stmt',
 318: 'sliceop',
 319: 'small_stmt',
 320: 'star_expr',
 321: 'stmt',
 322: 'subscript',
 323: 'subscriptlist',
 324: 'suite',
 325: 'term',
 326: 'test',
 327: 'test_nocond',
 328: 'testlist',
 329: 'testlist_comp',
 330: 'testlist_star_expr',
 331: 'tfpdef',
 332: 'trailer',
 333: 'try_stmt',
 334: 'typedargslist',
 335: 'varargslist',
 336: 'vfpdef',
 337: 'while_stmt',
 338: 'with_item',
 339: 'with_stmt',
 340: 'xor_expr',
 341: 'yield_arg',
 342: 'yield_expr',
 343: 'yield_stmt'},
dfas:
{256: [[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
       {2: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        42: 1,
        43: 1}],
 257: [[[[44, 1]], [[45, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 258: [[[[46, 1]], [[47, 0], [0, 1]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 259: [[[[48, 1]], [[49, 2]], [[50, 3], [0, 2]], [[49, 4]], [[0, 4]]], {48: 1}],
 260: [[[[51, 1]], [[52, 2], [0, 1]], [[51, 1], [0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1,
        53: 1}],
 261: [[[[35, 1], [49, 2], [53, 1]],
        [[49, 3]],
        [[50, 1], [54, 3], [0, 2]],
        [[0, 3]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1,
        53: 1}],
 262: [[[[55, 1]], [[10, 0], [32, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 263: [[[[21, 1]], [[49, 2]], [[52, 3], [0, 2]], [[49, 4]], [[0, 4]]], {21: 1}],
 264: [[[[42, 1]], [[56, 2]], [[0, 2]]], {42: 1}],
 265: [[[[42, 1]], [[57, 2], [56, 2], [58, 2]], [[0, 2]]], {42: 1}],
 266: [[[[13, 1],
         [17, 2],
         [11, 2],
         [18, 2],
         [28, 2],
         [20, 2],
         [23, 4],
         [19, 2],
         [27, 5],
         [33, 3]],
        [[59, 2], [60, 6]],
        [[0, 2]],
        [[61, 2], [62, 7], [60, 7]],
        [[63, 8], [64, 2]],
        [[27, 5], [0, 5]],
        [[59, 2]],
        [[61, 2]],
        [[64, 2]]],
       {11: 1, 13: 1, 17: 1, 18: 1, 19: 1, 20: 1, 23: 1, 27: 1, 28: 1, 33: 1}],
 267: [[[[12, 1], [65, 2]], [[65, 2]], [[66, 2], [0, 2]]],
       {11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        33: 1}],
 268: [[[[67, 1],
         [68, 1],
         [69, 1],
         [70, 1],
         [71, 1],
         [72, 1],
         [73, 1],
         [74, 1],
         [75, 1],
         [76, 1],
         [77, 1],
         [78, 1],
         [79, 1]],
        [[0, 1]]],
       {67: 1,
        68: 1,
        69: 1,
        70: 1,
        71: 1,
        72: 1,
        73: 1,
        74: 1,
        75: 1,
        76: 1,
        77: 1,
        78: 1,
        79: 1}],
 269: [[[[43, 1]], [[0, 1]]], {43: 1}],
 270: [[[[5, 1]],
        [[20, 2]],
        [[48, 3], [33, 4]],
        [[80, 5]],
        [[81, 6], [61, 7]],
        [[0, 5]],
        [[61, 7]],
        [[48, 3]]],
       {5: 1}],
 271: [[[[15, 1], [42, 2]],
        [[82, 3]],
        [[15, 1]],
        [[83, 4]],
        [[84, 5]],
        [[85, 6], [0, 5]],
        [[0, 6]]],
       {15: 1, 42: 1}],
 272: [[[[24, 1]], [[86, 2]], [[85, 3], [0, 2]], [[0, 3]]], {24: 1}],
 273: [[[[87, 1], [54, 1]], [[0, 1]]], {15: 1, 24: 1, 42: 1}],
 274: [[[[88, 1],
         [6, 2],
         [89, 1],
         [90, 1],
         [91, 3],
         [92, 1],
         [83, 1],
         [93, 1],
         [90, 1],
         [94, 1]],
        [[0, 1]],
        [[83, 1]],
        [[6, 1], [0, 3]]],
       {6: 1, 83: 1, 88: 1, 89: 1, 90: 1, 91: 1, 92: 1, 93: 1, 94: 1}],
 275: [[[[95, 1]], [[96, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 276: [[[[56, 1],
         [57, 1],
         [97, 1],
         [98, 1],
         [99, 1],
         [58, 1],
         [100, 1],
         [101, 1],
         [102, 1]],
        [[0, 1]]],
       {5: 1, 8: 1, 9: 1, 15: 1, 16: 1, 22: 1, 24: 1, 29: 1, 42: 1}],
 277: [[[[38, 1]], [[0, 1]]], {38: 1}],
 278: [[[[34, 1]], [[0, 1]]], {34: 1}],
 279: [[[[103, 1]], [[56, 2], [104, 2], [99, 2]], [[0, 2]]], {29: 1}],
 280: [[[[29, 1]],
        [[105, 2]],
        [[2, 3], [33, 4]],
        [[0, 3]],
        [[81, 5], [61, 6]],
        [[61, 6]],
        [[2, 3]]],
       {29: 1}],
 281: [[[[106, 1]], [[106, 1], [0, 1]]], {29: 1}],
 282: [[[[14, 1]], [[82, 2]], [[0, 2]]], {14: 1}],
 283: [[[[53, 3], [49, 2], [107, 1]],
        [[54, 5], [52, 4], [0, 1]],
        [[54, 5], [48, 6], [52, 4], [0, 2]],
        [[95, 7]],
        [[49, 8], [107, 8], [0, 4]],
        [[0, 5]],
        [[49, 7]],
        [[52, 9], [54, 5], [0, 7]],
        [[52, 4], [0, 8]],
        [[53, 10], [49, 11], [0, 9]],
        [[95, 12]],
        [[48, 13]],
        [[52, 9], [0, 12]],
        [[49, 12]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1,
        53: 1}],
 284: [[[[105, 1]], [[108, 2], [0, 1]], [[20, 3]], [[0, 3]]], {20: 1}],
 285: [[[[109, 1]], [[52, 0], [0, 1]]], {20: 1}],
 286: [[[[20, 1]], [[110, 0], [0, 1]]], {20: 1}],
 287: [[[[20, 1]], [[0, 1]]], {20: 1}],
 288: [[[[111, 1]], [[2, 1], [112, 2]], [[0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 289: [[[[113, 1]],
        [[49, 2], [0, 1]],
        [[108, 3], [52, 3], [0, 2]],
        [[49, 4]],
        [[0, 4]]],
       {113: 1}],
 290: [[[[114, 1]], [[115, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 291: [[[[116, 1]],
        [[50, 2], [117, 3], [118, 4], [0, 1]],
        [[116, 5], [62, 5]],
        [[0, 3]],
        [[62, 3], [111, 3]],
        [[50, 2], [0, 5]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1}],
 292: [[[[95, 1], [107, 1]], [[52, 2], [0, 1]], [[95, 1], [107, 1], [0, 2]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1}],
 293: [[[[10, 1], [36, 1], [119, 2], [32, 1]], [[120, 2]], [[0, 2]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 294: [[[[121, 0], [2, 0], [112, 1]], [[0, 1]]],
       {2: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        42: 1,
        43: 1,
        112: 1}],
 295: [[[[122, 1], [123, 1], [124, 1], [125, 1], [126, 1]], [[0, 1]]],
       {26: 1, 30: 1, 38: 1, 40: 1, 43: 1}],
 296: [[[[15, 1]],
        [[82, 2]],
        [[83, 3]],
        [[111, 4]],
        [[48, 5]],
        [[80, 6]],
        [[127, 7], [0, 6]],
        [[48, 8]],
        [[80, 9]],
        [[0, 9]]],
       {15: 1}],
 297: [[[[16, 1]],
        [[20, 2]],
        [[128, 3]],
        [[129, 4], [48, 5]],
        [[49, 6]],
        [[80, 7]],
        [[48, 5]],
        [[0, 7]]],
       {16: 1}],
 298: [[[[25, 1]], [[20, 2]], [[52, 1], [0, 2]]], {25: 1}],
 299: [[[[24, 1]],
        [[49, 2]],
        [[48, 3]],
        [[80, 4]],
        [[130, 1], [127, 5], [0, 4]],
        [[48, 6]],
        [[80, 7]],
        [[0, 7]]],
       {24: 1}],
 300: [[[[20, 1]], [[108, 2], [0, 1]], [[20, 3]], [[0, 3]]], {20: 1}],
 301: [[[[131, 1]], [[52, 2], [0, 1]], [[131, 1], [0, 2]]], {20: 1}],
 302: [[[[31, 1]],
        [[105, 2], [110, 3], [19, 3]],
        [[37, 4]],
        [[105, 2], [110, 3], [37, 4], [19, 3]],
        [[35, 5], [33, 6], [132, 5]],
        [[0, 5]],
        [[132, 7]],
        [[61, 5]]],
       {31: 1}],
 303: [[[[37, 1]], [[133, 2]], [[0, 2]]], {37: 1}],
 304: [[[[134, 1], [135, 1]], [[0, 1]]], {31: 1, 37: 1}],
 305: [[[[39, 1]], [[48, 2], [136, 3]], [[49, 4]], [[48, 2]], [[0, 4]]],
       {39: 1}],
 306: [[[[39, 1]], [[48, 2], [136, 3]], [[86, 4]], [[48, 2]], [[0, 4]]],
       {39: 1}],
 307: [[[[41, 1]], [[20, 2]], [[52, 1], [0, 2]]], {41: 1}],
 308: [[[[6, 1], [137, 2]], [[46, 2]], [[0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 309: [[[[138, 1]], [[139, 0], [0, 1]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 310: [[[[33, 1]], [[140, 2], [61, 3]], [[61, 3]], [[0, 3]]], {33: 1}],
 311: [[[[7, 1]], [[0, 1]]], {7: 1}],
 312: [[[[141, 1]], [[53, 2], [0, 1]], [[120, 3]], [[0, 3]]],
       {11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        33: 1}],
 313: [[[[4, 1]],
        [[49, 2], [142, 3], [0, 1]],
        [[52, 4], [0, 2]],
        [[49, 5]],
        [[49, 2], [0, 4]],
        [[52, 6], [0, 5]],
        [[49, 7]],
        [[52, 8], [0, 7]],
        [[49, 7], [0, 8]]],
       {4: 1}],
 314: [[[[40, 1]],
        [[49, 2], [0, 1]],
        [[52, 3], [31, 3], [0, 2]],
        [[49, 4]],
        [[52, 5], [0, 4]],
        [[49, 6]],
        [[0, 6]]],
       {40: 1}],
 315: [[[[30, 1]], [[111, 2], [0, 1]], [[0, 2]]], {30: 1}],
 316: [[[[143, 1]], [[144, 0], [142, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 317: [[[[145, 1]], [[146, 2], [2, 3]], [[145, 1], [2, 3]], [[0, 3]]],
       {4: 1,
        6: 1,
        7: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        23: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        43: 1}],
 318: [[[[48, 1]], [[49, 2], [0, 1]], [[0, 2]]], {48: 1}],
 319: [[[[147, 1],
         [148, 1],
         [149, 1],
         [150, 1],
         [151, 1],
         [152, 1],
         [153, 1],
         [154, 1],
         [155, 1],
         [156, 1]],
        [[0, 1]]],
       {4: 1,
        6: 1,
        7: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        23: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        43: 1}],
 320: [[[[35, 1]], [[95, 2]], [[0, 2]]], {35: 1}],
 321: [[[[1, 1], [3, 1]], [[0, 1]]],
       {4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        42: 1,
        43: 1}],
 322: [[[[48, 1], [49, 2]],
        [[157, 3], [49, 4], [0, 1]],
        [[48, 1], [0, 2]],
        [[0, 3]],
        [[157, 3], [0, 4]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1,
        48: 1}],
 323: [[[[158, 1]], [[52, 2], [0, 1]], [[158, 1], [0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1,
        48: 1}],
 324: [[[[1, 1], [2, 2]],
        [[0, 1]],
        [[159, 3]],
        [[121, 4]],
        [[160, 1], [121, 4]]],
       {2: 1,
        4: 1,
        6: 1,
        7: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        21: 1,
        23: 1,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        30: 1,
        31: 1,
        32: 1,
        33: 1,
        34: 1,
        35: 1,
        36: 1,
        37: 1,
        38: 1,
        39: 1,
        40: 1,
        41: 1,
        43: 1}],
 325: [[[[120, 1]], [[161, 0], [29, 0], [35, 0], [162, 0], [163, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 326: [[[[164, 1], [84, 2]],
        [[0, 1]],
        [[24, 3], [0, 2]],
        [[84, 4]],
        [[127, 5]],
        [[49, 1]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 327: [[[[165, 1], [84, 1]], [[0, 1]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 328: [[[[49, 1]], [[52, 2], [0, 1]], [[49, 1], [0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 329: [[[[49, 1], [107, 1]],
        [[54, 3], [52, 2], [0, 1]],
        [[49, 4], [107, 4], [0, 2]],
        [[0, 3]],
        [[52, 2], [0, 4]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1}],
 330: [[[[49, 1], [107, 1]], [[52, 2], [0, 1]], [[49, 1], [107, 1], [0, 2]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        35: 1,
        36: 1,
        39: 1}],
 331: [[[[20, 1]], [[48, 2], [0, 1]], [[49, 3]], [[0, 3]]], {20: 1}],
 332: [[[[13, 1], [110, 2], [33, 3]],
        [[166, 4]],
        [[20, 5]],
        [[81, 6], [61, 5]],
        [[59, 5]],
        [[0, 5]],
        [[61, 5]]],
       {13: 1, 33: 1, 110: 1}],
 333: [[[[8, 1]],
        [[48, 2]],
        [[80, 3]],
        [[167, 4], [168, 5]],
        [[48, 6]],
        [[48, 7]],
        [[80, 8]],
        [[80, 9]],
        [[167, 4], [168, 5], [127, 10], [0, 8]],
        [[0, 9]],
        [[48, 11]],
        [[80, 12]],
        [[168, 5], [0, 12]]],
       {8: 1}],
 334: [[[[169, 1], [35, 2], [53, 3]],
        [[50, 4], [52, 5], [0, 1]],
        [[169, 6], [52, 7], [0, 2]],
        [[169, 8]],
        [[49, 9]],
        [[169, 1], [35, 10], [53, 3], [0, 5]],
        [[52, 7], [0, 6]],
        [[169, 11], [53, 3], [0, 7]],
        [[52, 12], [0, 8]],
        [[52, 5], [0, 9]],
        [[169, 13], [52, 14], [0, 10]],
        [[50, 15], [52, 7], [0, 11]],
        [[0, 12]],
        [[52, 14], [0, 13]],
        [[169, 16], [53, 3], [0, 14]],
        [[49, 6]],
        [[50, 17], [52, 14], [0, 16]],
        [[49, 13]]],
       {20: 1, 35: 1, 53: 1}],
 335: [[[[35, 2], [170, 1], [53, 3]],
        [[50, 4], [52, 5], [0, 1]],
        [[170, 6], [52, 7], [0, 2]],
        [[170, 8]],
        [[49, 9]],
        [[170, 1], [35, 10], [53, 3], [0, 5]],
        [[52, 7], [0, 6]],
        [[170, 11], [53, 3], [0, 7]],
        [[52, 12], [0, 8]],
        [[52, 5], [0, 9]],
        [[170, 13], [52, 14], [0, 10]],
        [[50, 15], [52, 7], [0, 11]],
        [[0, 12]],
        [[52, 14], [0, 13]],
        [[170, 16], [53, 3], [0, 14]],
        [[49, 6]],
        [[50, 17], [52, 14], [0, 16]],
        [[49, 13]]],
       {20: 1, 35: 1, 53: 1}],
 336: [[[[20, 1]], [[0, 1]]], {20: 1}],
 337: [[[[9, 1]],
        [[49, 2]],
        [[48, 3]],
        [[80, 4]],
        [[127, 5], [0, 4]],
        [[48, 6]],
        [[80, 7]],
        [[0, 7]]],
       {9: 1}],
 338: [[[[49, 1]], [[108, 2], [0, 1]], [[95, 3]], [[0, 3]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 339: [[[[22, 1]], [[171, 2]], [[48, 3], [52, 1]], [[80, 4]], [[0, 4]]],
       {22: 1}],
 340: [[[[172, 1]], [[173, 0], [0, 1]]],
       {10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        32: 1,
        33: 1,
        36: 1}],
 341: [[[[111, 1], [31, 2]], [[0, 1]], [[49, 1]]],
       {6: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        17: 1,
        18: 1,
        19: 1,
        20: 1,
        23: 1,
        27: 1,
        28: 1,
        31: 1,
        32: 1,
        33: 1,
        36: 1,
        39: 1}],
 342: [[[[26, 1]], [[174, 2], [0, 1]], [[0, 2]]], {26: 1}],
 343: [[[[62, 1]], [[0, 1]]], {26: 1}]},
states:
[[[[1, 1], [2, 1], [3, 2]], [[0, 1]], [[2, 1]]],
 [[[44, 1]], [[45, 0], [0, 1]]],
 [[[46, 1]], [[47, 0], [0, 1]]],
 [[[48, 1]], [[49, 2]], [[50, 3], [0, 2]], [[49, 4]], [[0, 4]]],
 [[[51, 1]], [[52, 2], [0, 1]], [[51, 1], [0, 2]]],
 [[[35, 1], [49, 2], [53, 1]], [[49, 3]], [[50, 1], [54, 3], [0, 2]], [[0, 3]]],
 [[[55, 1]], [[10, 0], [32, 0], [0, 1]]],
 [[[21, 1]], [[49, 2]], [[52, 3], [0, 2]], [[49, 4]], [[0, 4]]],
 [[[42, 1]], [[56, 2]], [[0, 2]]],
 [[[42, 1]], [[57, 2], [56, 2], [58, 2]], [[0, 2]]],
 [[[13, 1],
   [17, 2],
   [11, 2],
   [18, 2],
   [28, 2],
   [20, 2],
   [23, 4],
   [19, 2],
   [27, 5],
   [33, 3]],
  [[59, 2], [60, 6]],
  [[0, 2]],
  [[61, 2], [62, 7], [60, 7]],
  [[63, 8], [64, 2]],
  [[27, 5], [0, 5]],
  [[59, 2]],
  [[61, 2]],
  [[64, 2]]],
 [[[12, 1], [65, 2]], [[65, 2]], [[66, 2], [0, 2]]],
 [[[67, 1],
   [68, 1],
   [69, 1],
   [70, 1],
   [71, 1],
   [72, 1],
   [73, 1],
   [74, 1],
   [75, 1],
   [76, 1],
   [77, 1],
   [78, 1],
   [79, 1]],
  [[0, 1]]],
 [[[43, 1]], [[0, 1]]],
 [[[5, 1]],
  [[20, 2]],
  [[48, 3], [33, 4]],
  [[80, 5]],
  [[81, 6], [61, 7]],
  [[0, 5]],
  [[61, 7]],
  [[48, 3]]],
 [[[15, 1], [42, 2]],
  [[82, 3]],
  [[15, 1]],
  [[83, 4]],
  [[84, 5]],
  [[85, 6], [0, 5]],
  [[0, 6]]],
 [[[24, 1]], [[86, 2]], [[85, 3], [0, 2]], [[0, 3]]],
 [[[87, 1], [54, 1]], [[0, 1]]],
 [[[88, 1],
   [6, 2],
   [89, 1],
   [90, 1],
   [91, 3],
   [92, 1],
   [83, 1],
   [93, 1],
   [90, 1],
   [94, 1]],
  [[0, 1]],
  [[83, 1]],
  [[6, 1], [0, 3]]],
 [[[95, 1]], [[96, 0], [0, 1]]],
 [[[56, 1],
   [57, 1],
   [97, 1],
   [98, 1],
   [99, 1],
   [58, 1],
   [100, 1],
   [101, 1],
   [102, 1]],
  [[0, 1]]],
 [[[38, 1]], [[0, 1]]],
 [[[34, 1]], [[0, 1]]],
 [[[103, 1]], [[56, 2], [104, 2], [99, 2]], [[0, 2]]],
 [[[29, 1]],
  [[105, 2]],
  [[2, 3], [33, 4]],
  [[0, 3]],
  [[81, 5], [61, 6]],
  [[61, 6]],
  [[2, 3]]],
 [[[106, 1]], [[106, 1], [0, 1]]],
 [[[14, 1]], [[82, 2]], [[0, 2]]],
 [[[53, 3], [49, 2], [107, 1]],
  [[54, 5], [52, 4], [0, 1]],
  [[54, 5], [48, 6], [52, 4], [0, 2]],
  [[95, 7]],
  [[49, 8], [107, 8], [0, 4]],
  [[0, 5]],
  [[49, 7]],
  [[52, 9], [54, 5], [0, 7]],
  [[52, 4], [0, 8]],
  [[53, 10], [49, 11], [0, 9]],
  [[95, 12]],
  [[48, 13]],
  [[52, 9], [0, 12]],
  [[49, 12]]],
 [[[105, 1]], [[108, 2], [0, 1]], [[20, 3]], [[0, 3]]],
 [[[109, 1]], [[52, 0], [0, 1]]],
 [[[20, 1]], [[110, 0], [0, 1]]],
 [[[20, 1]], [[0, 1]]],
 [[[111, 1]], [[2, 1], [112, 2]], [[0, 2]]],
 [[[113, 1]],
  [[49, 2], [0, 1]],
  [[108, 3], [52, 3], [0, 2]],
  [[49, 4]],
  [[0, 4]]],
 [[[114, 1]], [[115, 0], [0, 1]]],
 [[[116, 1]],
  [[50, 2], [117, 3], [118, 4], [0, 1]],
  [[116, 5], [62, 5]],
  [[0, 3]],
  [[62, 3], [111, 3]],
  [[50, 2], [0, 5]]],
 [[[95, 1], [107, 1]], [[52, 2], [0, 1]], [[95, 1], [107, 1], [0, 2]]],
 [[[10, 1], [36, 1], [119, 2], [32, 1]], [[120, 2]], [[0, 2]]],
 [[[121, 0], [2, 0], [112, 1]], [[0, 1]]],
 [[[122, 1], [123, 1], [124, 1], [125, 1], [126, 1]], [[0, 1]]],
 [[[15, 1]],
  [[82, 2]],
  [[83, 3]],
  [[111, 4]],
  [[48, 5]],
  [[80, 6]],
  [[127, 7], [0, 6]],
  [[48, 8]],
  [[80, 9]],
  [[0, 9]]],
 [[[16, 1]],
  [[20, 2]],
  [[128, 3]],
  [[129, 4], [48, 5]],
  [[49, 6]],
  [[80, 7]],
  [[48, 5]],
  [[0, 7]]],
 [[[25, 1]], [[20, 2]], [[52, 1], [0, 2]]],
 [[[24, 1]],
  [[49, 2]],
  [[48, 3]],
  [[80, 4]],
  [[130, 1], [127, 5], [0, 4]],
  [[48, 6]],
  [[80, 7]],
  [[0, 7]]],
 [[[20, 1]], [[108, 2], [0, 1]], [[20, 3]], [[0, 3]]],
 [[[131, 1]], [[52, 2], [0, 1]], [[131, 1], [0, 2]]],
 [[[31, 1]],
  [[105, 2], [110, 3], [19, 3]],
  [[37, 4]],
  [[105, 2], [110, 3], [37, 4], [19, 3]],
  [[35, 5], [33, 6], [132, 5]],
  [[0, 5]],
  [[132, 7]],
  [[61, 5]]],
 [[[37, 1]], [[133, 2]], [[0, 2]]],
 [[[134, 1], [135, 1]], [[0, 1]]],
 [[[39, 1]], [[48, 2], [136, 3]], [[49, 4]], [[48, 2]], [[0, 4]]],
 [[[39, 1]], [[48, 2], [136, 3]], [[86, 4]], [[48, 2]], [[0, 4]]],
 [[[41, 1]], [[20, 2]], [[52, 1], [0, 2]]],
 [[[6, 1], [137, 2]], [[46, 2]], [[0, 2]]],
 [[[138, 1]], [[139, 0], [0, 1]]],
 [[[33, 1]], [[140, 2], [61, 3]], [[61, 3]], [[0, 3]]],
 [[[7, 1]], [[0, 1]]],
 [[[141, 1]], [[53, 2], [0, 1]], [[120, 3]], [[0, 3]]],
 [[[4, 1]],
  [[49, 2], [142, 3], [0, 1]],
  [[52, 4], [0, 2]],
  [[49, 5]],
  [[49, 2], [0, 4]],
  [[52, 6], [0, 5]],
  [[49, 7]],
  [[52, 8], [0, 7]],
  [[49, 7], [0, 8]]],
 [[[40, 1]],
  [[49, 2], [0, 1]],
  [[52, 3], [31, 3], [0, 2]],
  [[49, 4]],
  [[52, 5], [0, 4]],
  [[49, 6]],
  [[0, 6]]],
 [[[30, 1]], [[111, 2], [0, 1]], [[0, 2]]],
 [[[143, 1]], [[144, 0], [142, 0], [0, 1]]],
 [[[145, 1]], [[146, 2], [2, 3]], [[145, 1], [2, 3]], [[0, 3]]],
 [[[48, 1]], [[49, 2], [0, 1]], [[0, 2]]],
 [[[147, 1],
   [148, 1],
   [149, 1],
   [150, 1],
   [151, 1],
   [152, 1],
   [153, 1],
   [154, 1],
   [155, 1],
   [156, 1]],
  [[0, 1]]],
 [[[35, 1]], [[95, 2]], [[0, 2]]],
 [[[1, 1], [3, 1]], [[0, 1]]],
 [[[48, 1], [49, 2]],
  [[157, 3], [49, 4], [0, 1]],
  [[48, 1], [0, 2]],
  [[0, 3]],
  [[157, 3], [0, 4]]],
 [[[158, 1]], [[52, 2], [0, 1]], [[158, 1], [0, 2]]],
 [[[1, 1], [2, 2]], [[0, 1]], [[159, 3]], [[121, 4]], [[160, 1], [121, 4]]],
 [[[120, 1]], [[161, 0], [29, 0], [35, 0], [162, 0], [163, 0], [0, 1]]],
 [[[164, 1], [84, 2]],
  [[0, 1]],
  [[24, 3], [0, 2]],
  [[84, 4]],
  [[127, 5]],
  [[49, 1]]],
 [[[165, 1], [84, 1]], [[0, 1]]],
 [[[49, 1]], [[52, 2], [0, 1]], [[49, 1], [0, 2]]],
 [[[49, 1], [107, 1]],
  [[54, 3], [52, 2], [0, 1]],
  [[49, 4], [107, 4], [0, 2]],
  [[0, 3]],
  [[52, 2], [0, 4]]],
 [[[49, 1], [107, 1]], [[52, 2], [0, 1]], [[49, 1], [107, 1], [0, 2]]],
 [[[20, 1]], [[48, 2], [0, 1]], [[49, 3]], [[0, 3]]],
 [[[13, 1], [110, 2], [33, 3]],
  [[166, 4]],
  [[20, 5]],
  [[81, 6], [61, 5]],
  [[59, 5]],
  [[0, 5]],
  [[61, 5]]],
 [[[8, 1]],
  [[48, 2]],
  [[80, 3]],
  [[167, 4], [168, 5]],
  [[48, 6]],
  [[48, 7]],
  [[80, 8]],
  [[80, 9]],
  [[167, 4], [168, 5], [127, 10], [0, 8]],
  [[0, 9]],
  [[48, 11]],
  [[80, 12]],
  [[168, 5], [0, 12]]],
 [[[169, 1], [35, 2], [53, 3]],
  [[50, 4], [52, 5], [0, 1]],
  [[169, 6], [52, 7], [0, 2]],
  [[169, 8]],
  [[49, 9]],
  [[169, 1], [35, 10], [53, 3], [0, 5]],
  [[52, 7], [0, 6]],
  [[169, 11], [53, 3], [0, 7]],
  [[52, 12], [0, 8]],
  [[52, 5], [0, 9]],
  [[169, 13], [52, 14], [0, 10]],
  [[50, 15], [52, 7], [0, 11]],
  [[0, 12]],
  [[52, 14], [0, 13]],
  [[169, 16], [53, 3], [0, 14]],
  [[49, 6]],
  [[50, 17], [52, 14], [0, 16]],
  [[49, 13]]],
 [[[35, 2], [170, 1], [53, 3]],
  [[50, 4], [52, 5], [0, 1]],
  [[170, 6], [52, 7], [0, 2]],
  [[170, 8]],
  [[49, 9]],
  [[170, 1], [35, 10], [53, 3], [0, 5]],
  [[52, 7], [0, 6]],
  [[170, 11], [53, 3], [0, 7]],
  [[52, 12], [0, 8]],
  [[52, 5], [0, 9]],
  [[170, 13], [52, 14], [0, 10]],
  [[50, 15], [52, 7], [0, 11]],
  [[0, 12]],
  [[52, 14], [0, 13]],
  [[170, 16], [53, 3], [0, 14]],
  [[49, 6]],
  [[50, 17], [52, 14], [0, 16]],
  [[49, 13]]],
 [[[20, 1]], [[0, 1]]],
 [[[9, 1]],
  [[49, 2]],
  [[48, 3]],
  [[80, 4]],
  [[127, 5], [0, 4]],
  [[48, 6]],
  [[80, 7]],
  [[0, 7]]],
 [[[49, 1]], [[108, 2], [0, 1]], [[95, 3]], [[0, 3]]],
 [[[22, 1]], [[171, 2]], [[48, 3], [52, 1]], [[80, 4]], [[0, 4]]],
 [[[172, 1]], [[173, 0], [0, 1]]],
 [[[111, 1], [31, 2]], [[0, 1]], [[49, 1]]],
 [[[26, 1]], [[174, 2], [0, 1]], [[0, 2]]],
 [[[62, 1]], [[0, 1]]]],
labels:
[[0, 'EMPTY'],
 [317, null],
 [4, null],
 [276, null],
 [1, 'print'],
 [1, 'class'],
 [1, 'not'],
 [1, 'pass'],
 [1, 'try'],
 [1, 'while'],
 [15, null],
 [2, null],
 [54, null],
 [9, null],
 [1, 'del'],
 [1, 'for'],
 [1, 'def'],
 [1, 'False'],
 [1, 'null'],
 [52, null],
 [1, null],
 [1, 'assert'],
 [1, 'with'],
 [25, null],
 [1, 'if'],
 [1, 'global'],
 [1, 'yield'],
 [3, null],
 [1, 'True'],
 [49, null],
 [1, 'return'],
 [1, 'from'],
 [14, null],
 [7, null],
 [1, 'debugger'],
 [16, null],
 [31, null],
 [1, 'import'],
 [1, 'continue'],
 [1, 'lambda'],
 [1, 'raise'],
 [1, 'nonlocal'],
 [55, null],
 [1, 'break'],
 [316, null],
 [19, null],
 [308, null],
 [1, 'and'],
 [11, null],
 [326, null],
 [22, null],
 [261, null],
 [12, null],
 [35, null],
 [271, null],
 [325, null],
 [297, null],
 [339, null],
 [296, null],
 [10, null],
 [329, null],
 [8, null],
 [342, null],
 [283, null],
 [26, null],
 [266, null],
 [332, null],
 [38, null],
 [46, null],
 [44, null],
 [41, null],
 [37, null],
 [42, null],
 [50, null],
 [40, null],
 [45, null],
 [36, null],
 [39, null],
 [43, null],
 [48, null],
 [324, null],
 [260, null],
 [292, null],
 [1, 'in'],
 [309, null],
 [273, null],
 [327, null],
 [272, null],
 [30, null],
 [27, null],
 [28, null],
 [1, 'is'],
 [21, null],
 [29, null],
 [20, null],
 [290, null],
 [274, null],
 [279, null],
 [337, null],
 [270, null],
 [333, null],
 [299, null],
 [265, null],
 [281, null],
 [264, null],
 [286, null],
 [280, null],
 [320, null],
 [1, 'as'],
 [284, null],
 [23, null],
 [328, null],
 [0, null],
 [1, 'except'],
 [340, null],
 [18, null],
 [330, null],
 [259, null],
 [268, null],
 [312, null],
 [293, null],
 [321, null],
 [315, null],
 [269, null],
 [314, null],
 [277, null],
 [343, null],
 [1, 'else'],
 [310, null],
 [51, null],
 [1, 'elif'],
 [300, null],
 [301, null],
 [285, null],
 [302, null],
 [303, null],
 [335, null],
 [275, null],
 [258, null],
 [1, 'or'],
 [334, null],
 [267, null],
 [34, null],
 [262, null],
 [33, null],
 [319, null],
 [13, null],
 [278, null],
 [298, null],
 [282, null],
 [304, null],
 [311, null],
 [291, null],
 [295, null],
 [263, null],
 [313, null],
 [307, null],
 [318, null],
 [322, null],
 [5, null],
 [6, null],
 [17, null],
 [47, null],
 [24, null],
 [305, null],
 [306, null],
 [323, null],
 [289, null],
 [1, 'finally'],
 [331, null],
 [336, null],
 [338, null],
 [257, null],
 [32, null],
 [341, null]],
keywords:
{'False': 17,
 'null': 18,
 'True': 28,
 'and': 47,
 'as': 108,
 'assert': 21,
 'break': 43,
 'class': 5,
 'continue': 38,
 'debugger': 34,
 'def': 16,
 'del': 14,
 'elif': 130,
 'else': 127,
 'except': 113,
 'finally': 168,
 'for': 15,
 'from': 31,
 'global': 25,
 'if': 24,
 'import': 37,
 'in': 83,
 'is': 91,
 'lambda': 39,
 'nonlocal': 41,
 'not': 6,
 'or': 139,
 'pass': 7,
 'print': 4,
 'raise': 40,
 'return': 30,
 'try': 8,
 'while': 9,
 'with': 22,
 'yield': 26},
tokens:
{0: 112,
 1: 20,
 2: 11,
 3: 27,
 4: 2,
 5: 159,
 6: 160,
 7: 33,
 8: 61,
 9: 13,
 10: 59,
 11: 48,
 12: 52,
 13: 146,
 14: 32,
 15: 10,
 16: 35,
 17: 161,
 18: 115,
 19: 45,
 20: 94,
 21: 92,
 22: 50,
 23: 110,
 24: 163,
 25: 23,
 26: 64,
 27: 89,
 28: 90,
 29: 93,
 30: 88,
 31: 36,
 32: 173,
 33: 144,
 34: 142,
 35: 53,
 36: 76,
 37: 71,
 38: 67,
 39: 77,
 40: 74,
 41: 70,
 42: 72,
 43: 78,
 44: 69,
 45: 75,
 46: 68,
 47: 162,
 48: 79,
 49: 29,
 50: 73,
 51: 129,
 52: 19,
 54: 12,
 55: 42},
start: 256
};
