function $builtinmodule() {
    const base64 = {};

    const {
        str: pyStr,
        bytes: pyBytes,
    } = Sk.builtin;

    var b64encode = function(s) {
        // Should consume a bytes object and produce a bytes object
        Sk.builtin.pyCheckArgs("b64encode", arguments, 1, 1, false, false);
        return new pyBytes(btoa(s.$jsstr()));
    };
    b64encode.co_varnames = ["s"];
    base64.b64encode = new Sk.builtin.func(b64encode);


    var b64decode = function(s) {
        Sk.builtin.pyCheckArgs("b64decode", arguments, 1, 1, false, false);
        return new pyBytes(atob(s.$jsstr()));
    };
    b64decode.co_varnames = ["s"];
    base64.b64decode = new Sk.builtin.func(b64decode);


    return base64;
}