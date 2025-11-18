var $builtinmodule = function (name) {
    var mod = {};
    ("use strict");

    const { str: pyStr } = Sk.builtin;

    const nameStr = new pyStr("name");
    const defaultStr = new pyStr("default");
    const emptyStr = new pyStr("empty");
    const parametersStr = new pyStr("parameters");
    const kindStr = new pyStr("kind");

    mod.EmptyParameter = Sk.abstr.buildNativeClass("inspect.EmptyParameter", {
        constructor: function() {
            // Empty class used as a singleton
        }
    })

    const emptySingleton = Sk.misceval.callsim(mod.EmptyParameter);

    mod.Parameter = Sk.abstr.buildNativeClass("inspect.Parameter", {
        constructor: function(name$, default$, kind$, annotation$) {
            this.name$ = name$;
            this.default$ = default$;
            this.kind$ = kind$;
            this.annotation$ = annotation$ || emptySingleton;
        },
        slots: {
            tp$getattr: Sk.generic.getAttr,
            tp$new(args, kws) {
                let [name, default$, kind$, annotation$] = Sk.abstr.copyKeywordsToNamedArgs(
                    "Parameter",
                    ["name", "default", "kind", "annotation"],
                    args,kws, [null, null, null, emptySingleton]);
                return new this.constructor(name, default$, kind$, annotation$);
            },
            $r() {
                return new pyStr(
                    `Parameter(${this.name$.v}, ${this.kind$.v}, default=${this.default$.v}, annotation=${this.annotation$.v})`
                )
            }
        },
        getsets: {
            "name_$rw$": {
                $get() {
                    return this.name$;
                }
            },
            "default_$rw$": {
                $get() {
                    return this.default$;
                }
            },
            kind: {
                $get() {
                    return this.kind$;
                }
            },
            annotation: {
                $get() {
                    return this.annotation$;
                }
            }
        }
    });
    mod.Parameter.prototype.empty = emptySingleton;
    mod.Parameter.prototype.POSITIONAL_ONLY = new pyStr("POSITIONAL_ONLY");
    mod.Parameter.prototype.POSITIONAL_OR_KEYWORD = new pyStr("POSITIONAL_OR_KEYWORD");
    mod.Parameter.prototype.VAR_POSITIONAL = new pyStr("VAR_POSITIONAL");
    mod.Parameter.prototype.KEYWORD_ONLY = new pyStr("KEYWORD_ONLY");
    mod.Parameter.prototype.VAR_KEYWORD = new pyStr("VAR_KEYWORD");


    mod.Signature = Sk.abstr.buildNativeClass("inspect.Signature", {
        constructor: function(parameters) {
            this.parameters = parameters;
        },
        slots: {
            tp$getattr: Sk.generic.getAttr,
            $r() {
                const paramStr = this.parameters.$r().v;
                return new pyStr(`Signature(parameters=${paramStr})`);
            },
            tp$new(args, kws) {
                let [parameters] = Sk.abstr.copyKeywordsToNamedArgs(
                    "Signature",
                    ["parameters"],
                    args,kws, [null]);
                return new this.constructor(parameters);
            }
        },
        getsets: {
            parameters: {
                $get() {
                    return this.parameters;
                }
            }
        }
    })

    mod.signature = new Sk.builtin.func(function (funct) {
        // `co_varnames` and `$defaults`
        // TODO: Should be an ordered dict
        const parameters = new Sk.builtin.dict([]);
        if (funct.co_varnames) {
            let annotations = {};
            if (funct.func_annotations && funct.func_annotations.length) {
                for (let i = 0; i < funct.func_annotations.length; i += 2) {
                    annotations[funct.func_annotations[i]] = funct.func_annotations[i + 1];
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
                parameters.mp$ass_subscript(
                    name,
                    Sk.misceval.callsim(
                        mod.Parameter,
                        name,
                        default$,
                        new pyStr("POSITIONAL_OR_KEYWORD"),
                        annotations[funct.co_varnames[i]]
                    )
                );
            }
        }
        if (funct.co_kwargs) {
            parameters.mp$ass_subscript(
                new pyStr("kwargs"),
                Sk.misceval.callsim(
                    mod.Parameter,
                    new pyStr("kwargs"),
                    emptySingleton,
                    new pyStr("VAR_KEYWORD"),
                    emptySingleton
                )
            );
        }
        if (funct.co_varargs) {
            parameters.mp$ass_subscript(
                new pyStr("args"),
                Sk.misceval.callsim(
                    mod.Parameter,
                    new pyStr("args"),
                    emptySingleton,
                    new pyStr("VAR_POSITIONAL"),
                    emptySingleton
                )
            );
        }
        return Sk.misceval.callsim(mod.Signature, parameters);
    });

    return mod;
};
