function BaseExc_new(args, kws) {
    const instance = new this.constructor();
    if (this.ht$type) {
        BaseException.call(instance);
    }
    // called from python so do the args here
    instance.args = new Sk.builtin.tuple(args.slice(0));
    return instance;
}

function BaseExc_init(args, kws) {
    Sk.abstr.checkNoKwargs(Sk.abstr.typeName(this), kws);
    this.args = new Sk.builtin.tuple(args.slice(0));
}

function simpleExtends(base, name, doc) {
    const tp$init = base.prototype.tp$init;
    const slots = { tp$doc: doc, tp$init };
    if (tp$init === BaseExc_init) {
        slots.tp$new = BaseExc_new;
    }
    return Sk.abstr.buildNativeClass(name, {
        base,
        constructor: function pyExc(...args) {
            base.apply(this, args);
        },
        slots,
        flags: {
            sk$solidBase: false,
        },
    });
}

var $builtinmodule = function (name) {
    "use strict";
    var mod = {};

    // skipkeys=False,
    // ensure_ascii=True,
    // check_circular=True,
    // allow_nan=True,
    // cls=None,
    // indent=None,
    // separators=None,
    // encoding="utf-8",
    // default=None,
    // sort_keys=False,
    // **kw

    var dumps_f = function (kwa) {
        Sk.builtin.pyCheckArgs("dumps", arguments, 1, Infinity, true, false);

        var args = Array.prototype.slice.call(arguments, 1),
            kwargs = new Sk.builtins.dict(kwa),
            sort_keys = false,
            stringify_opts, default_, jsobj, str;

        // default stringify options
        stringify_opts = {
            ascii: true,
            separators: {
                item_separator: ", ",
                key_separator: ": "
            }
        };

        kwargs = Sk.ffi.remapToJs(kwargs);
        jsobj = Sk.ffi.remapToJs(args[0]);

        // TODO: likely need to go through character by character to enable this
        if (typeof (kwargs.ensure_ascii) === "boolean" && kwargs.ensure_ascii === false) {
            stringify_opts.ascii = false;
        }

        // TODO: javascript sort isn't entirely compatible with python's
        if (typeof (kwargs.sort_keys) === "boolean" && kwargs.sort_keys) {
            sort_keys = true;
        }

        if (!sort_keys) {
            // don't do any sorting unless sort_keys is true
            // if sort_keys use stringify's default sort, which is alphabetical
            stringify_opts.cmp = function (a, b) {
                return 0;
            };
        }

        // item_separator, key_separator) tuple. The default is (', ', ': ').
        if (typeof (kwargs.separators) === "object" && kwargs.separators.length == 2) {
            stringify_opts.separators.item_separator = kwargs.separators[0];
            stringify_opts.separators.key_separator = kwargs.separators[1];
        }

        // TODO: if indent is 0 it should add newlines
        if (kwargs.indent) {
            stringify_opts.space = kwargs.indent;
        }

        // Sk.ffi.remapToJs doesn't map functions
        if (kwargs.default) {
        }

        // may need to create a clone of this to have more control/options
        try {
            str = JSON.stringify(jsobj, stringify_opts, kwargs.indent || 1);
        } catch (e) {
            throw new JSONEncodeError(e.message);
        }

        return new Sk.builtin.str(str);
    };

    dumps_f.co_kwargs = true;
    mod.dumps = new Sk.builtin.func(dumps_f);

    // encoding[, cls[, object_hook[, parse_float[, parse_int[, parse_constant[, object_pairs_hook[, **kw]]]]]]]
    var loads_f = function (kwa) {
        Sk.builtin.pyCheckArgs("loads", arguments, 1, Infinity, true, false);

        var args = Array.prototype.slice.call(arguments, 1),
            kwargs = new Sk.builtins.dict(kwa),
            str, obj;

        kwargs = Sk.ffi.remapToJs(kwargs);
        str = args[0].v;
        try {
            obj = JSON.parse(str);
        } catch (e) {
            throw new JSONDecodeError(e.message);
        }

        return Sk.ffi.remapToPy(obj);
    };

    loads_f.co_kwargs = true;
    mod.loads = new Sk.builtin.func(loads_f);

    var load_f = function (kwa) {
        Sk.builtin.pyCheckArgs("load", arguments, 1, Infinity, true, false);

        var args = Array.prototype.slice.call(arguments, 1),
            kwargs = new Sk.builtins.dict(kwa),
            str, obj, file;

        kwargs = Sk.ffi.remapToJs(kwargs);
        file = args[0];
        str = Sk.misceval.callsim(Sk.builtin.file.prototype["read"], file).v;
        obj = JSON.parse(str);

        return Sk.ffi.remapToPy(obj);
    };

    load_f.co_kwargs = true;
    mod.load = new Sk.builtin.func(load_f);

    const JSONDecodeError = mod.JSONDecodeError = simpleExtends(Sk.builtin.ValueError, "JSONDecodeError", "Subclass of ValueError with the JSON decoder.");
    const JSONEncodeError = mod.JSONEncodeError = simpleExtends(Sk.builtin.ValueError, "JSONEncodeError", "Subclass of ValueError with the JSON encoder.");

    return mod;
};