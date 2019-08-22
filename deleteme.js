/* eslint-disable */

/*     1 */ $compiledmod = function() {
/*     2 */     var $scope149 = (function($forcegbl) {
/*     3 */         var $loadname164, $loadname164, $call169;
/*     4 */         var $wakeFromSuspension = function() {
/*     5 */             var susp = $scope149.$wakingSuspension;
/*     6 */             $scope149.$wakingSuspension = undefined;
/*     7 */             $blk = susp.$blk;
/*     8 */             $loc = susp.$loc;
/*     9 */             $gbl = susp.$gbl;
/*    10 */             $exc = susp.$exc;
/*    11 */             $err = susp.$err;
/*    12 */             $postfinally = susp.$postfinally;
/*    13 */             $currLineNo = susp.$lineno;
/*    14 */             $currColNo = susp.$colno;
/*    15 */             Sk.lastYield = Date.now();
/*    16 */             $loadname164 = susp.$tmps.$loadname164;
/*    17 */             $call169 = susp.$tmps.$call169;
/*    18 */             try {
/*    19 */                 $ret = susp.child.resume();
/*    20 */             } catch (err) {
/*    21 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*    22 */                     Sk.execStart = Date.now();
/*    23 */                     Sk.execPaused = 0;
/*    24 */                 }
/*    25 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*    26 */                     err = new Sk.builtin.ExternalError(err);
/*    27 */                 }
/*    28 */                 err.traceback.push({
/*    29 */                     lineno: $currLineNo,
/*    30 */                     colno: $currColNo,
/*    31 */                     filename: '.\test/test_names.py'
/*    32 */                 });
/*    33 */                 if ($exc.length > 0) {
/*    34 */                     $err = err;
/*    35 */                     Sk.err = $err;
/*    36 */                     $blk = $exc.pop();
/*    37 */                 } else {
/*    38 */                     throw err;
/*    39 */                 }
/*    40 */             }
/*    41 */         };
/*    42 */         var $saveSuspension = function($child, $filename, $lineno, $colno) {
/*    43 */             var susp = new Sk.misceval.Suspension();
/*    44 */             susp.child = $child;
/*    45 */             susp.resume = function() {
/*    46 */                 $scope149.$wakingSuspension = susp;
/*    47 */                 return $scope149();
/*    48 */             };
/*    49 */             susp.data = susp.child.data;
/*    50 */             susp.$blk = $blk;
/*    51 */             susp.$loc = $loc;
/*    52 */             susp.$gbl = $gbl;
/*    53 */             susp.$exc = $exc;
/*    54 */             susp.$err = $err;
/*    55 */             susp.$postfinally = $postfinally;
/*    56 */             susp.$filename = $filename;
/*    57 */             susp.$lineno = $lineno;
/*    58 */             susp.$colno = $colno;
/*    59 */             susp.optional = susp.child.optional;
/*    60 */             susp.$tmps = {
/*    61 */                 "$loadname164": $loadname164,
/*    62 */                 "$call169": $call169
/*    63 */             };
/*    64 */             return susp;
/*    65 */         };
/*    66 */         var $gbl = $forcegbl || {},
/*    67 */             $blk = 0,
/*    68 */             $exc = [],
/*    69 */             $loc = $gbl,
/*    70 */             $cell = {},
/*    71 */             $err = undefined;
/*    72 */         $loc.__file__ = new Sk.builtins.str('.\test/test_names.py');
/*    73 */         var $ret = undefined,
/*    74 */             $postfinally = undefined,
/*    75 */             $currLineNo = undefined,
/*    76 */             $currColNo = undefined;
/*    77 */         if (typeof Sk.execStart === 'undefined') {
/*    78 */             Sk.execStart = Date.now();
/*    79 */             Sk.execPaused = 0
/*    80 */         }
/*    81 */         if (typeof Sk.lastYield === 'undefined') {
/*    82 */             Sk.lastYield = Date.now()
/*    83 */         }
/*    84 */         if ($scope149.$wakingSuspension !== undefined) {
/*    85 */             $wakeFromSuspension();
/*    86 */         }
/*    87 */         if (Sk.retainGlobals) {
/*    88 */             if (Sk.globals) {
/*    89 */                 $gbl = Sk.globals;
/*    90 */                 Sk.globals = $gbl;
/*    91 */                 $loc = $gbl;
/*    92 */                 $loc.__file__ = new Sk.builtins.str('.\test/test_names.py');
/*    93 */             } else {
/*    94 */                 Sk.globals = $gbl;
/*    95 */             }
/*    96 */         } else {
/*    97 */             Sk.globals = $gbl;
/*    98 */         }
/*    99 */         while (true) {
/*   100 */             try {
/*   101 */                 var $dateNow = Date.now();
/*   102 */                 if (Sk.execLimit !== null && $dateNow - Sk.execStart - Sk.execPaused > Sk.execLimit) {
/*   103 */                     throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg())
/*   104 */                 }
/*   105 */                 if ($dateNow - Sk.lastYield > Sk.yieldLimit) {
/*   106 */                     var $susp = $saveSuspension({
/*   107 */                         data: {
/*   108 */                             type: 'Sk.yield'
/*   109 */                         },
/*   110 */                         resume: function() {}
/*   111 */                     }, '.\test/test_names.py', $currLineNo, $currColNo);
/*   112 */                     $susp.$blk = $blk;
/*   113 */                     $susp.optional = true;
/*   114 */                     return $susp;
/*   115 */                 }
/*   116 */                 switch ($blk) {
/*   117 */                     case 0:
/*   118 */                         /* --- module entry --- */
/*   119 */                         //
/*   120 */                         // line 1:
/*   121 */                         // def a_scope(propertyIsEnumerable, cat, length, banana):
/*   122 */                         // ^
/*   123 */                         //
/*   124 */
/*   125 */                         $currLineNo = Sk.currLineNo = 1;
/*   126 */                         $currColNo = Sk.currColNo = 0;
/*   127 */                         Sk.currFilename = '.\test/test_names.py';
/*   128 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 1, 0, ".\\test/test_names.py");
/*   129 */                         $scope150.co_name = new Sk.builtins['str']('a_scope');
/*   130 */                         $scope150.co_varnames = ['propertyIsEnumerable', 'cat', 'length', 'banana'];
/*   131 */                         var $funcobj163 = new Sk.builtins['function']($scope150, $gbl);
/*   132 */                         $loc.a_scope = $funcobj163;
/*   133 */                         //
/*   134 */                         // line 10:
/*   135 */                         // a_scope("ada", "pumpkin", "mittens", "pele")()
/*   136 */                         // ^
/*   137 */                         //
/*   138 */
/*   139 */                         $currLineNo = Sk.currLineNo = 10;
/*   140 */                         $currColNo = Sk.currColNo = 0;
/*   141 */                         Sk.currFilename = '.\test/test_names.py';
/*   142 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 10, 0, ".\\test/test_names.py");
/*   143 */                         var $loadname164 = $loc.a_scope !== undefined ? $loc.a_scope : Sk.misceval.loadname('a_scope', $gbl);;
/*   144 */                         $ret = Sk.misceval.callsimOrSuspendArray($loadname164, [$scope149.$const165, $scope149.$const166, $scope149.$const167, $scope149.$const168]);
/*   145 */                         $blk = 1; /* allowing case fallthrough */
/*   146 */                     case 1:
/*   147 */                         /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
/*   148 */                             return $saveSuspension($ret, '.\test/test_names.py', 10, 0);
/*   149 */                         }
/*   150 */                         var $call169 = $ret;
/*   151 */                         //
/*   152 */                         // line 10:
/*   153 */                         // a_scope("ada", "pumpkin", "mittens", "pele")()
/*   154 */                         // ^
/*   155 */                         //
/*   156 */
/*   157 */                         $currLineNo = Sk.currLineNo = 10;
/*   158 */                         $currColNo = Sk.currColNo = 0;
/*   159 */                         Sk.currFilename = '.\test/test_names.py';
/*   160 */                         $ret = Sk.misceval.callsimOrSuspendArray($call169);
/*   161 */                         $blk = 2; /* allowing case fallthrough */
/*   162 */                     case 2:
/*   163 */                         /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
/*   164 */                             return $saveSuspension($ret, '.\test/test_names.py', 10, 0);
/*   165 */                         }
/*   166 */                         var $call170 = $ret;
/*   167 */                         //
/*   168 */                         // line 10:
/*   169 */                         // a_scope("ada", "pumpkin", "mittens", "pele")()
/*   170 */                         // ^
/*   171 */                         //
/*   172 */
/*   173 */                         $currLineNo = Sk.currLineNo = 10;
/*   174 */                         $currColNo = Sk.currColNo = 0;
/*   175 */                         Sk.currFilename = '.\test/test_names.py';
/*   176 */                         return $loc;
/*   177 */                         throw new Sk.builtin.SystemError('internal error: unterminated block');
/*   178 */                 }
/*   179 */             } catch (err) {
/*   180 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*   181 */                     Sk.execStart = Date.now();
/*   182 */                     Sk.execPaused = 0
/*   183 */                 }
/*   184 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*   185 */                     err = new Sk.builtin.ExternalError(err);
/*   186 */                 }
/*   187 */                 err.traceback.push({
/*   188 */                     lineno: $currLineNo,
/*   189 */                     colno: $currColNo,
/*   190 */                     filename: '.\test/test_names.py'
/*   191 */                 });
/*   192 */                 if ($exc.length > 0) {
/*   193 */                     $err = err;
/*   194 */                     $blk = $exc.pop();
/*   195 */                     continue;
/*   196 */                 } else {
/*   197 */                     throw err;
/*   198 */                 }
/*   199 */             }
/*   200 */         }
/*   201 */     });
/*   202 */     $scope149.$const165 = new Sk.builtin.str('ada');
/*   203 */     $scope149.$const166 = new Sk.builtin.str('pumpkin');
/*   204 */     $scope149.$const167 = new Sk.builtin.str('mittens');
/*   205 */     $scope149.$const168 = new Sk.builtin.str('pele');
/*   206 */     var $scope150 = (function $a_scope151$(propertyIsEnumerable_$rn$, cat, length_$rn$, banana) {
/*   207 */         // has cell
/*   208 */         var inner_scope; /* locals */
/*   209 */         var inner_scope, inner_scope;
/*   210 */         var $wakeFromSuspension = function() {
/*   211 */             var susp = $scope150.$wakingSuspension;
/*   212 */             $scope150.$wakingSuspension = undefined;
/*   213 */             $blk = susp.$blk;
/*   214 */             $loc = susp.$loc;
/*   215 */             $gbl = susp.$gbl;
/*   216 */             $exc = susp.$exc;
/*   217 */             $err = susp.$err;
/*   218 */             $postfinally = susp.$postfinally;
/*   219 */             $currLineNo = susp.$lineno;
/*   220 */             $currColNo = susp.$colno;
/*   221 */             Sk.lastYield = Date.now();
/*   222 */             $cell = susp.$cell;
/*   223 */             inner_scope = susp.$tmps.inner_scope;
/*   224 */             try {
/*   225 */                 $ret = susp.child.resume();
/*   226 */             } catch (err) {
/*   227 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*   228 */                     Sk.execStart = Date.now();
/*   229 */                     Sk.execPaused = 0;
/*   230 */                 }
/*   231 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*   232 */                     err = new Sk.builtin.ExternalError(err);
/*   233 */                 }
/*   234 */                 err.traceback.push({
/*   235 */                     lineno: $currLineNo,
/*   236 */                     colno: $currColNo,
/*   237 */                     filename: '.\test/test_names.py'
/*   238 */                 });
/*   239 */                 if ($exc.length > 0) {
/*   240 */                     $err = err;
/*   241 */                     Sk.err = $err;
/*   242 */                     $blk = $exc.pop();
/*   243 */                 } else {
/*   244 */                     throw err;
/*   245 */                 }
/*   246 */             }
/*   247 */         };
/*   248 */         var $saveSuspension = function($child, $filename, $lineno, $colno) {
/*   249 */             var susp = new Sk.misceval.Suspension();
/*   250 */             susp.child = $child;
/*   251 */             susp.resume = function() {
/*   252 */                 $scope150.$wakingSuspension = susp;
/*   253 */                 return $scope150();
/*   254 */             };
/*   255 */             susp.data = susp.child.data;
/*   256 */             susp.$blk = $blk;
/*   257 */             susp.$loc = $loc;
/*   258 */             susp.$gbl = $gbl;
/*   259 */             susp.$exc = $exc;
/*   260 */             susp.$err = $err;
/*   261 */             susp.$postfinally = $postfinally;
/*   262 */             susp.$filename = $filename;
/*   263 */             susp.$lineno = $lineno;
/*   264 */             susp.$colno = $colno;
/*   265 */             susp.optional = susp.child.optional;
/*   266 */             susp.$cell = $cell;
/*   267 */             susp.$tmps = {
/*   268 */                 "inner_scope": inner_scope
/*   269 */             };
/*   270 */             return susp;
/*   271 */         };
/*   272 */         var $blk = 0,
/*   273 */             $exc = [],
/*   274 */             $loc = {},
/*   275 */             $cell = {},
/*   276 */             $gbl = this,
/*   277 */             $err = undefined,
/*   278 */             $ret = undefined,
/*   279 */             $postfinally = undefined,
/*   280 */             $currLineNo = undefined,
/*   281 */             $currColNo = undefined;
/*   282 */         if (typeof Sk.execStart === 'undefined') {
/*   283 */             Sk.execStart = Date.now();
/*   284 */             Sk.execPaused = 0
/*   285 */         }
/*   286 */         if (typeof Sk.lastYield === 'undefined') {
/*   287 */             Sk.lastYield = Date.now()
/*   288 */         }
/*   289 */         if ($scope150.$wakingSuspension !== undefined) {
/*   290 */             $wakeFromSuspension();
/*   291 */         } else {
/*   292 */             $cell.cat = cat;
/*   293 */             $cell.banana = banana;
/*   294 */         }
/*   295 */         while (true) {
/*   296 */             try {
/*   297 */                 var $dateNow = Date.now();
/*   298 */                 if (Sk.execLimit !== null && $dateNow - Sk.execStart - Sk.execPaused > Sk.execLimit) {
/*   299 */                     throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg())
/*   300 */                 }
/*   301 */                 if ($dateNow - Sk.lastYield > Sk.yieldLimit) {
/*   302 */                     var $susp = $saveSuspension({
/*   303 */                         data: {
/*   304 */                             type: 'Sk.yield'
/*   305 */                         },
/*   306 */                         resume: function() {}
/*   307 */                     }, '.\test/test_names.py', $currLineNo, $currColNo);
/*   308 */                     $susp.$blk = $blk;
/*   309 */                     $susp.optional = true;
/*   310 */                     return $susp;
/*   311 */                 }
/*   312 */                 switch ($blk) {
/*   313 */                     case 0:
/*   314 */                         /* --- codeobj entry --- */
/*   315 */                         //
/*   316 */                         // line 2:
/*   317 */                         //     def inner_scope():
/*   318 */                         //     ^
/*   319 */                         //
/*   320 */
/*   321 */                         $currLineNo = Sk.currLineNo = 2;
/*   322 */                         $currColNo = Sk.currColNo = 4;
/*   323 */                         Sk.currFilename = '.\test/test_names.py';
/*   324 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 2, 4, ".\\test/test_names.py");
/*   325 */                         $scope152.co_name = new Sk.builtins['str']('inner_scope');
/*   326 */                         $scope152.co_varnames = [];
/*   327 */                         var $funcobj162 = new Sk.builtins['function']($scope152, $gbl, $cell);
/*   328 */                         inner_scope = $funcobj162;
/*   329 */                         //
/*   330 */                         // line 7:
/*   331 */                         //     return inner_scope
/*   332 */                         //     ^
/*   333 */                         //
/*   334 */
/*   335 */                         $currLineNo = Sk.currLineNo = 7;
/*   336 */                         $currColNo = Sk.currColNo = 4;
/*   337 */                         Sk.currFilename = '.\test/test_names.py';
/*   338 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 7, 4, ".\\test/test_names.py");
/*   339 */                         if (inner_scope === undefined) {
/*   340 */                             throw new Sk.builtin.UnboundLocalError('local variable \'inner_scope\' referenced before assignment');
/*   341 */                         }
/*   342 */                         return inner_scope;
/*   343 */                         return Sk.builtin.none.none$;
/*   344 */                         throw new Sk.builtin.SystemError('internal error: unterminated block');
/*   345 */                 }
/*   346 */             } catch (err) {
/*   347 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*   348 */                     Sk.execStart = Date.now();
/*   349 */                     Sk.execPaused = 0
/*   350 */                 }
/*   351 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*   352 */                     err = new Sk.builtin.ExternalError(err);
/*   353 */                 }
/*   354 */                 err.traceback.push({
/*   355 */                     lineno: $currLineNo,
/*   356 */                     colno: $currColNo,
/*   357 */                     filename: '.\test/test_names.py'
/*   358 */                 });
/*   359 */                 if ($exc.length > 0) {
/*   360 */                     $err = err;
/*   361 */                     $blk = $exc.pop();
/*   362 */                     continue;
/*   363 */                 } else {
/*   364 */                     throw err;
/*   365 */                 }
/*   366 */             }
/*   367 */         }
/*   368 */     });
/*   369 */     var $scope152 = (function $inner_scope153$($free) {
/*   370 */         // has free
/*   371 */         var $free;
/*   372 */         var $wakeFromSuspension = function() {
/*   373 */             var susp = $scope152.$wakingSuspension;
/*   374 */             $scope152.$wakingSuspension = undefined;
/*   375 */             $blk = susp.$blk;
/*   376 */             $loc = susp.$loc;
/*   377 */             $gbl = susp.$gbl;
/*   378 */             $exc = susp.$exc;
/*   379 */             $err = susp.$err;
/*   380 */             $postfinally = susp.$postfinally;
/*   381 */             $currLineNo = susp.$lineno;
/*   382 */             $currColNo = susp.$colno;
/*   383 */             Sk.lastYield = Date.now();
/*   384 */             $free = susp.$tmps.$free;
/*   385 */             try {
/*   386 */                 $ret = susp.child.resume();
/*   387 */             } catch (err) {
/*   388 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*   389 */                     Sk.execStart = Date.now();
/*   390 */                     Sk.execPaused = 0;
/*   391 */                 }
/*   392 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*   393 */                     err = new Sk.builtin.ExternalError(err);
/*   394 */                 }
/*   395 */                 err.traceback.push({
/*   396 */                     lineno: $currLineNo,
/*   397 */                     colno: $currColNo,
/*   398 */                     filename: '.\test/test_names.py'
/*   399 */                 });
/*   400 */                 if ($exc.length > 0) {
/*   401 */                     $err = err;
/*   402 */                     Sk.err = $err;
/*   403 */                     $blk = $exc.pop();
/*   404 */                 } else {
/*   405 */                     throw err;
/*   406 */                 }
/*   407 */             }
/*   408 */         };
/*   409 */         var $saveSuspension = function($child, $filename, $lineno, $colno) {
/*   410 */             var susp = new Sk.misceval.Suspension();
/*   411 */             susp.child = $child;
/*   412 */             susp.resume = function() {
/*   413 */                 $scope152.$wakingSuspension = susp;
/*   414 */                 return $scope152();
/*   415 */             };
/*   416 */             susp.data = susp.child.data;
/*   417 */             susp.$blk = $blk;
/*   418 */             susp.$loc = $loc;
/*   419 */             susp.$gbl = $gbl;
/*   420 */             susp.$exc = $exc;
/*   421 */             susp.$err = $err;
/*   422 */             susp.$postfinally = $postfinally;
/*   423 */             susp.$filename = $filename;
/*   424 */             susp.$lineno = $lineno;
/*   425 */             susp.$colno = $colno;
/*   426 */             susp.optional = susp.child.optional;
/*   427 */             susp.$tmps = {
/*   428 */                 "$free": $free
/*   429 */             };
/*   430 */             return susp;
/*   431 */         };
/*   432 */         var $blk = 0,
/*   433 */             $exc = [],
/*   434 */             $loc = {},
/*   435 */             $cell = {},
/*   436 */             $gbl = this,
/*   437 */             $err = undefined,
/*   438 */             $ret = undefined,
/*   439 */             $postfinally = undefined,
/*   440 */             $currLineNo = undefined,
/*   441 */             $currColNo = undefined;
/*   442 */         if (typeof Sk.execStart === 'undefined') {
/*   443 */             Sk.execStart = Date.now();
/*   444 */             Sk.execPaused = 0
/*   445 */         }
/*   446 */         if (typeof Sk.lastYield === 'undefined') {
/*   447 */             Sk.lastYield = Date.now()
/*   448 */         }
/*   449 */         if ($scope152.$wakingSuspension !== undefined) {
/*   450 */             $wakeFromSuspension();
/*   451 */         } else {}
/*   452 */         while (true) {
/*   453 */             try {
/*   454 */                 var $dateNow = Date.now();
/*   455 */                 if (Sk.execLimit !== null && $dateNow - Sk.execStart - Sk.execPaused > Sk.execLimit) {
/*   456 */                     throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg())
/*   457 */                 }
/*   458 */                 if ($dateNow - Sk.lastYield > Sk.yieldLimit) {
/*   459 */                     var $susp = $saveSuspension({
/*   460 */                         data: {
/*   461 */                             type: 'Sk.yield'
/*   462 */                         },
/*   463 */                         resume: function() {}
/*   464 */                     }, '.\test/test_names.py', $currLineNo, $currColNo);
/*   465 */                     $susp.$blk = $blk;
/*   466 */                     $susp.optional = true;
/*   467 */                     return $susp;
/*   468 */                 }
/*   469 */                 switch ($blk) {
/*   470 */                     case 0:
/*   471 */                         /* --- codeobj entry --- */
/*   472 */                         //
/*   473 */                         // line 3:
/*   474 */                         //         cat+"meow"
/*   475 */                         //         ^
/*   476 */                         //
/*   477 */
/*   478 */                         $currLineNo = Sk.currLineNo = 3;
/*   479 */                         $currColNo = Sk.currColNo = 8;
/*   480 */                         Sk.currFilename = '.\test/test_names.py';
/*   481 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 3, 8, ".\\test/test_names.py");
/*   482 */                         var $binop155 = Sk.abstr.numberBinOp($free.cat, $scope152.$const154, 'Add');
/*   483 */                         //
/*   484 */                         // line 4:
/*   485 */                         //         banana+"puffin"
/*   486 */                         //         ^
/*   487 */                         //
/*   488 */
/*   489 */                         $currLineNo = Sk.currLineNo = 4;
/*   490 */                         $currColNo = Sk.currColNo = 8;
/*   491 */                         Sk.currFilename = '.\test/test_names.py';
/*   492 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 4, 8, ".\\test/test_names.py");
/*   493 */                         var $binop157 = Sk.abstr.numberBinOp($free.banana, $scope152.$const156, 'Add');
/*   494 */                         //
/*   495 */                         // line 5:
/*   496 */                         //         propertyIsEnumerable+"anything"
/*   497 */                         //         ^
/*   498 */                         //
/*   499 */
/*   500 */                         $currLineNo = Sk.currLineNo = 5;
/*   501 */                         $currColNo = Sk.currColNo = 8;
/*   502 */                         Sk.currFilename = '.\test/test_names.py';
/*   503 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 5, 8, ".\\test/test_names.py");
/*   504 */                         var $binop159 = Sk.abstr.numberBinOp($free.propertyIsEnumerable_$rn$, $scope152.$const158, 'Add');
/*   505 */                         //
/*   506 */                         // line 6:
/*   507 */                         //         length+"jango"
/*   508 */                         //         ^
/*   509 */                         //
/*   510 */
/*   511 */                         $currLineNo = Sk.currLineNo = 6;
/*   512 */                         $currColNo = Sk.currColNo = 8;
/*   513 */                         Sk.currFilename = '.\test/test_names.py';
/*   514 */                         Sk.afterSingleExecution && Sk.afterSingleExecution($gbl, $loc, 6, 8, ".\\test/test_names.py");
/*   515 */                         var $binop161 = Sk.abstr.numberBinOp($free.length_$rn$, $scope152.$const160, 'Add');
/*   516 */                         return Sk.builtin.none.none$;
/*   517 */                         throw new Sk.builtin.SystemError('internal error: unterminated block');
/*   518 */                 }
/*   519 */             } catch (err) {
/*   520 */                 if (err instanceof Sk.builtin.TimeLimitError) {
/*   521 */                     Sk.execStart = Date.now();
/*   522 */                     Sk.execPaused = 0
/*   523 */                 }
/*   524 */                 if (!(err instanceof Sk.builtin.BaseException)) {
/*   525 */                     err = new Sk.builtin.ExternalError(err);
/*   526 */                 }
/*   527 */                 err.traceback.push({
/*   528 */                     lineno: $currLineNo,
/*   529 */                     colno: $currColNo,
/*   530 */                     filename: '.\test/test_names.py'
/*   531 */                 });
/*   532 */                 if ($exc.length > 0) {
/*   533 */                     $err = err;
/*   534 */                     $blk = $exc.pop();
/*   535 */                     continue;
/*   536 */                 } else {
/*   537 */                     throw err;
/*   538 */                 }
/*   539 */             }
/*   540 */         }
/*   541 */     });
/*   542 */     $scope152.$const154 = new Sk.builtin.str('meow');
/*   543 */     $scope152.$const156 = new Sk.builtin.str('puffin');
/*   544 */     $scope152.$const158 = new Sk.builtin.str('anything');
/*   545 */     $scope152.$const160 = new Sk.builtin.str('jango');
/*   546 */     return $scope149;
/*   547 */ }();