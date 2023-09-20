var $builtinmodule = function (name) {
    var mod = {__name__: new Sk.builtin.str("js_console")};

    mod.debug = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("debug", arguments);
        console.debug(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });
    mod.log = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("log", arguments);
        console.log(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });
    mod.warning = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("warning", arguments);
        console.warn(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });

    mod.error = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("error", arguments);
        console.error(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });

    mod.info = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("info", arguments);
        console.info(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });

    mod.critical = new Sk.builtin.func(function () {
        Sk.builtin.pyCheckArgs("critical", arguments);
        console.log(([...arguments]).map(Sk.ffi.remapToJs));
        return Sk.builtin.none.none$;
    });

    return mod;
};