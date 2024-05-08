function $builtinmodule() {
    const parse = {};
    return Sk.misceval.chain(Sk.importModule("collections", false, true), (collections_mod) => {
        parse._namedtuple = collections_mod.$d.namedtuple;
        return parse_mod(parse);
    });
}

function parse_mod(parse) {
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
        gattr: objectGetAttr,
    } = Sk.abstr;

    const { getSetDict: genericGetSetDict, getAttr: genericGetAttr, setAttr: genericSetAttr } = Sk.generic;


    const emptyString = new Sk.builtin.str("");

    const _ParseResult = (pyCall(
        parse._namedtuple,
        ["ParseResult", ["scheme", "netloc", "path", "params", "query", "fragment"]].map((x) => toPy(x)),
        ["module", new pyStr("parse")]
    ));
    _ParseResult.geturl = new Sk.builtin.func(function(self) {
        console.log("TEST");
        console.log(self, arguments);
    });
    const _ParseResultExtended = Sk.abstr.buildNativeClass("ParseResult", {
        base: _ParseResult,
        constructor: function (...args) {
            _ParseResult.apply(this, args);
        },
        methods: {
            geturl: {
                $flags: {NoArgs: true},
                $meth() {
                    const baseUrl = new URL("https://localhost");
                    baseUrl.protocol = toJs(this.tp$getattr(new pyStr("scheme")));
                    baseUrl.host = toJs(this.tp$getattr(new pyStr("netloc")));
                    baseUrl.pathname = toJs(this.tp$getattr(new pyStr("path")));
                    baseUrl.params = toJs(this.tp$getattr(new pyStr("params")));
                    baseUrl.search = toJs(this.tp$getattr(new pyStr("query")));
                    baseUrl.hash = "#" + toJs(this.tp$getattr(new pyStr("fragment")));
                    return new pyStr(baseUrl.toString());
                },
            }
        }
    });
    parse._ParseResult = _ParseResultExtended;

    var urlparse_ = function (urlstring, scheme, allow_fragments) {
        Sk.builtin.pyCheckArgs("urlparse", arguments, 1, 3, true, false);

        let components, usedBase = false;
        try {
            components = new URL(urlstring.v);
        } catch (e) {
            try {
                components = new URL(urlstring.v, "https://localhost");
                usedBase = true;
                //components.href = urlstring.v;
            } catch (e) {
                throw new ValueError(`invalid URL given: '${urlstring.v}'`);
            }
        }
        scheme = scheme.v;

        return pyCallOrSuspend(_ParseResultExtended,  [
            scheme || (usedBase ? "" : components.protocol),
            usedBase ? "" : components.host,
            components.pathname,
            emptyString, // Nobody actually uses params
            components.search.slice(1),
            components.hash.slice(1)

        ].map((x) => toPy(x)));
    };
    urlparse_.co_varnames = ["urlstring", "scheme", "allow_fragments"];
    urlparse_.$defaults = [emptyString, emptyString, pyTrue];
    parse.urlparse = new Sk.builtin.func(urlparse_);

    var quote_plus_ = function(string, safe, encoding, errors) {
        Sk.builtin.pyCheckArgs("quote_plus", arguments, 1, 4, true, false);
        let encoded = encodeURIComponent(string.v).replace(/%20/g,"+");
        return new pyStr(encoded);
    };
    quote_plus_.co_varnames = ["string", "safe", "encoding", "errors"];
    quote_plus_.$defaults = [emptyString, emptyString, pyNone, pyNone];
    parse.quote_plus = new Sk.builtin.func(quote_plus_);

    // urlencode, urlparse, parse_qs
    // TODO: geturl (and make sure _replace works)
    var parse_qs_ = function(qs, keep_blank_values, strict_parsing, encoding, errors, max_num_fields, separator) {
        Sk.builtin.pyCheckArgs("parse_qs", arguments, 1, 7, true, false);

        let params;
        try {
            params = new URLSearchParams(qs.v);
        } catch (e) {
            if (isTrue(strict_parsing)) {
                throw new ValueError(`invalid query string given: '${qs.v}'`);
            } else {
                return new pyDict([]);
            }
        }

        const asDict = [];
        params.forEach((value, key) => {
            if (isTrue(keep_blank_values) || value) {
                asDict.push(new pyStr(key));
                asDict.push(new pyStr(value));
            }
        });

        return new pyDict(asDict);
    };
    parse_qs_.co_varnames = ["qs", "keep_blank_values", "strict_parsing", "encoding", "errors", "max_num_fields", "separator"];
    parse_qs_.$defaults = [emptyString, pyFalse, pyFalse, new pyStr("utf-8"), new pyStr("replace"), pyNone, new pyStr("&")];
    parse.parse_qs = new Sk.builtin.func(parse_qs_);

    var urlencode_ = function(query, doseq, safe, encoding, errors, quote_via) {
        Sk.builtin.pyCheckArgs("urlencode", arguments, 1, 6, true, false);
        const encoded = [];
        query.$items().forEach(([key, val]) => {
            // TODO: Check if doseq needs to be handled
            // Basically, if a key can be repeated because its value is a list
            encoded.push(encodeURIComponent(key.v) + "=" + encodeURIComponent(val.v));
        });
        return encoded.join("&");
    };
    urlencode_.co_varnames = ["query", "doseq", "safe", "encoding", "errors", "quote_via"];
    urlencode_.$defaults = [emptyString, pyFalse, emptyString, pyNone, pyNone, parse.quote_plus];
    parse.urlencode = new Sk.builtin.func(urlencode_);

    return parse;
};
