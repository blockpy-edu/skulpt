var $builtinmodule = function (name) {
    var mod = {};
    "use strict";

    var EmptyParameter = function ($gbl, $loc) {};
    mod.EmptyParameter = Sk.misceval.buildClass(mod, EmptyParameter, "EmptyParameter", []);

    const nameStr = new Sk.builtin.str("name");
    const defaultStr = new Sk.builtin.str("default");
    const emptyStr = new Sk.builtin.str("empty");
    const parametersStr = new Sk.builtin.str("parameters");

    const emptySingleton = Sk.misceval.callsim(mod.EmptyParameter);

    var Parameter = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, name, default$) {
            Sk.abstr.sattr(self, nameStr, name, true);
            Sk.abstr.sattr(self, defaultStr, default$, true);
            return Sk.builtin.none.none$;
        });
    };

    mod.Parameter = Sk.misceval.buildClass(mod, Parameter, "Parameter", []);

    Sk.abstr.sattr(mod.Parameter, emptyStr, emptySingleton, true);

    var Signature = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, parameters) {
            Sk.abstr.sattr(self, parametersStr, parameters, true);
            return Sk.builtin.none.none$;
        });
    };
    mod.Signature = Sk.misceval.buildClass(mod, Signature, "Signature", []);

    mod.signature = new Sk.builtin.func(function (funct) {
        // `co_varnames` and `$defaults`
        const parameters = new Sk.builtin.dict([]);
        if (funct.co_varnames) {
            for (let i = 0; i < funct.co_varnames.length; i += 1) {
                let name = new Sk.builtin.str(funct.co_varnames[i]);
                let default$;
                const threshold = funct.co_varnames.length - funct.$defaults.length;
                if (i >= threshold) {
                    default$ = funct.$defaults[i - threshold];
                } else {
                    default$ = emptySingleton;
                }
                parameters.mp$ass_subscript(name, Sk.misceval.callsim(mod.Parameter, name, default$));
            }
        }
        return Sk.misceval.callsim(mod.Signature, parameters);
    });

    return mod;
};