function $builtinmodule() {
    const gzip = {};

    const {
        object: pyObject,
        int_: pyInt,
        str: pyStr,
        list: pyList,
        tuple: pyTuple,
        dict: pyDict,
        none: { none$: pyNone },
        bool: { false$: pyFalse, true$: pyTrue },
        NotImplemented: { NotImplemented$: pyNotImplemented },
        bool: pyBool,
        func: pyFunc,
        method: pyMethod,
        TypeError: pyTypeError,
        RuntimeError,
        ValueError,
        NotImplementedError,
        AttributeErrror,
        OverflowError,
        checkNone,
        checkBool,
        checkCallable,
        checkClass,
    } = Sk.builtin;

    const {
        callsimArray: pyCall,
        callsimOrSuspendArray: pyCallOrSuspend,
        iterFor,
        chain,
        isIndex,
        asIndexSized,
        isTrue,
        richCompareBool,
        objectRepr,
    } = Sk.misceval;

    const { remapToPy: toPy } = Sk.ffi;

    const {
        buildNativeClass,
        setUpModuleMethods,
        keywordArrayFromPyDict,
        keywordArrayToPyDict,
        objectHash,
        lookupSpecial,
        copyKeywordsToNamedArgs,
        typeName,
        iter: objectGetIter,
        sattr: objectSetAttr,
        gattr: objectGetAttr,
    } = Sk.abstr;

    const { getSetDict: genericGetSetDict, getAttr: genericGetAttr, setAttr: genericSetAttr } = Sk.generic;

    // https://stackoverflow.com/a/59469189/1718155
    function promiseCompress(string, encoding) {
        const byteArray = string; new TextEncoder().encode(string);
        const cs = new CompressionStream(encoding);
        const writer = cs.writable.getWriter();
        writer.write(byteArray);
        writer.close();
        return new Response(cs.readable).arrayBuffer();
    }

    function promiseDecompress(byteArray, encoding) {
        const cs = new DecompressionStream(encoding);
        const writer = cs.writable.getWriter();
        writer.write(byteArray);
        writer.close();
        return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
            return arrayBuffer; //new TextDecoder().decode(arrayBuffer);
        });
    }

    var compress = function(data, compresslevel, mtime) {
        return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            promiseCompress(data.v, "gzip").then((result) => {
                return resolve(new Sk.builtin.bytes(new Uint8Array(result)));
            });
        }));
    };
    compress.co_varnames = ["data", "compresslevel", "mtime"];
    compress.$defaults = [new pyInt(9), pyNone];
    gzip.compress = new Sk.builtin.func(compress);


    var decompress = function(data) {
        Sk.builtin.pyCheckArgs("decompress", arguments, 1, 1, false, false);
        return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            promiseDecompress(data.v, "gzip").then((result) => {
                return resolve(new Sk.builtin.bytes(new Uint8Array(result)));
            });
        }));
    };
    decompress.co_varnames = ["data"];
    gzip.decompress = new Sk.builtin.func(decompress);
    return gzip;
}