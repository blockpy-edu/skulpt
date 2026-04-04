function $builtinmodule() {
    const {
        builtin: { str: pyStr },
        misceval: { callsimArray: pyCall },
        ffi: { toPy, toJs },
        abstr: { gattr },
    } = Sk;

    const jsMod = { __name__: new pyStr("js") };
    const jsProxy = toPy(Sk.global);

    Sk.abstr.setUpModuleMethods("js", jsMod, {
        __getattr__: {
            $meth(pyName) {
                return gattr(jsProxy, pyName, true);
            },
            $flags: { OneArg: true },
        },
        __setattr__: {
            $meth(pyName, pyValue) {
                Sk.global[pyName.v] = toJs(pyValue);
            },
            $flags: { MinArgs: 2, MaxArgs: 2 },
        },
        __dir__: {
            $meth() {
                return pyCall(jsProxy.tp$getattr(pyStr.$dir));
            },
            $flags: { NoArgs: true },
        },
    });
    return jsMod;
}
