var $builtinmodule = function (name) {
    var mod = {};
    "use strict";

    const {str: pyStr} = Sk.builtin;

    var EmptyParameter = function ($gbl, $loc) {};
    mod.EmptyParameter = Sk.misceval.buildClass(mod, EmptyParameter, "EmptyParameter", []);

    const nameStr = new pyStr("name");
    const defaultStr = new pyStr("default");
    const emptyStr = new pyStr("empty");
    const parametersStr = new pyStr("parameters");
    const kindStr = new pyStr("kind");

    const emptySingleton = Sk.misceval.callsim(mod.EmptyParameter);

    var Parameter = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, name, default$, kind$, annotation$) {
            Sk.abstr.sattr(self, nameStr, name, true);
            Sk.abstr.sattr(self, defaultStr, default$, true);
            Sk.abstr.sattr(self, kindStr, kind$, true);
            Sk.abstr.sattr(self, new pyStr("annotation"), annotation$ || emptySingleton, true);
            return Sk.builtin.none.none$;
        });
    };

    mod.Parameter = Sk.misceval.buildClass(mod, Parameter, "Parameter", []);
    Sk.abstr.sattr(mod.Parameter, emptyStr, emptySingleton, true);
    ["POSITIONAL_ONLY", "POSITIONAL_OR_KEYWORD", "VAR_POSITIONAL", "KEYWORD_ONLY", "VAR_KEYWORD"].forEach((paramDescription) => {
        Sk.abstr.sattr(mod.Parameter, new pyStr(paramDescription), new pyStr(paramDescription), true);
    });

    var Signature = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, parameters) {
            Sk.abstr.sattr(self, parametersStr, parameters, true);
            return Sk.builtin.none.none$;
        });
        /*$loc.replace = new Sk.builtin.func(function (self, parameters, return_annotation) {
            // TODO: Copy the parameters properly, also allow keyword args!
            return Sk.misceval.callsim(mod.Signature, parameters);
        });*/
    };
    mod.Signature = Sk.misceval.buildClass(mod, Signature, "Signature", []);

    mod.signature = new Sk.builtin.func(function (funct) {
        // `co_varnames` and `$defaults`
        // TODO: Should be an ordered dict
        const parameters = new Sk.builtin.dict([]);
        if (funct.co_varnames) {
            let annotations = {};
            if (funct.func_annotations && funct.func_annotations.length) {
                for (let i=0 ; i < funct.func_annotations.length; i += 2) {
                    annotations[funct.func_annotations[i]] = funct.func_annotations[i+1];
                }
            }

            for (let i = 0; i < funct.co_varnames.length; i += 1) {
                let name = new pyStr(funct.co_varnames[i]);
                let default$;
                const threshold = funct.co_varnames.length - funct.$defaults.length;
                if (i >= threshold) {
                    default$ = funct.$defaults[i - threshold];
                } else {
                    default$ = emptySingleton;
                }
                parameters.mp$ass_subscript(name, Sk.misceval.callsim(mod.Parameter, name, default$, new pyStr("POSITIONAL_OR_KEYWORD"), 
                                                                      annotations[funct.co_varnames[i]]));
            }
        }
        if (funct.co_kwargs) {
            parameters.mp$ass_subscript(new pyStr("kwargs"), Sk.misceval.callsim(mod.Parameter, new pyStr("kwargs"), emptySingleton, new pyStr("VAR_KEYWORD"), emptySingleton));
        }
        if (funct.co_varargs) {
            parameters.mp$ass_subscript(new pyStr("args"), Sk.misceval.callsim(mod.Parameter, new pyStr("args"), emptySingleton, new pyStr("VAR_POSITIONAL"), emptySingleton));
        }
        return Sk.misceval.callsim(mod.Signature, parameters);
    });

    return mod;
};