/**
 * @constructor
 * @extends {Sk.builtin.object}
 */
Sk.builtin.module = Sk.abstr.buildNativeClass("module", {
    constructor: function module_ () {},
    slots: {
        tp$doc: "Create a module object.\n\nThe name must be a string; the optional doc argument can have any type.",
        tp$init: function(args, kwargs) {
            Sk.abstr.checkArgsLen(this.tp$name, args, 1, 3);
            this["$d"] = {
                "__name__": args[0],
                "__package__": Sk.builtin.none.none$,
            };
            return Sk.builtin.none.none$;
        },
        tp$getattr: function (pyName, canSuspend) {
            let customGetAttr = this.$d["__getattr__"];
            if (customGetAttr) {
                const ret = Sk.misceval.callsimArray(customGetAttr, [pyName]);
                if (ret !== undefined) {
                    return ret;
                }
            }
            var jsMangled = pyName.$mangled;
            const ret = this.$d[jsMangled];
            if (ret !== undefined) {
                return ret;
            }
            // technically this is the wrong way round but its seems performance wise better
            // to just return the module elements before checking for descriptors
            const descr = this.ob$type.$typeLookup(pyName);
            if (descr !== undefined) {
                const f = descr.tp$descr_get;
                if (f) {
                    return f.call(descr, this, this.ob$type, canSuspend);
                }
            }
        },
        $r: function () {
            let get = (s) => {
                let v = this.tp$getattr(new Sk.builtin.str(s));
                return Sk.misceval.objectRepr(v || Sk.builtin.str.$emptystr);
            };
            const _name = get("__name__");
            let _file = get("__file__");
            if (_file === "''") {
                _file = "(built-in)";
            } else {
                _file = "from " + _file;
            }
            return new Sk.builtin.str("<module " + _name + " " + _file + ">");
        }
    },
    getsets: {
        __dict__: {
            $get: function () {
                // modules in skulpt have a $d as a js object so just return it as a mapping proxy;
                // TODO we should really have a dict object 
                return new Sk.builtin.mappingproxy(this.$d);
            }
        }
    }
});

Sk.exportSymbol("Sk.builtin.module", Sk.builtin.module);
