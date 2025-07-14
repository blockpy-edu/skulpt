function $builtinmodule() {
    const html = {};

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

    const { remapToPy: toPy, remapToJs: toJs } = Sk.ffi;

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

    const escapeHtml = (unsafe, quote) => {
        let newVersion = unsafe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        if (quote) {
            newVersion = newVersion.replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
        }
        return newVersion;
    };
    const escapeTextArea = document.createElement("textarea");

    var escape = function(s, quote) {
        Sk.builtin.pyCheckArgs("escape", arguments, 1, 2, false, false);
        /*const replacer = toJs(quote) ? allTagsToReplace : tagsToReplace;
        return toJs(s).replace(/[^<>]/g, function(tag) {
            return replacer[tag] || tag;
        });*/
        /*escapeTextArea.textContent = toJs(s);
        return new Sk.builtin.str(escapeTextArea.innerHTML);*/
        const newVersion = escapeHtml(toJs(s), toJs(quote));
        return new Sk.builtin.str(newVersion);
    };
    escape.co_varnames = ["s", "quote"];
    escape.$defaults = [pyTrue];
    html.escape = new Sk.builtin.func(escape);
    return html;
}