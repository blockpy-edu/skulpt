function $builtinmodule() {
    const bottle = {};

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

    const rootStr = new pyStr("root");
    const defaultRouteStr = new pyStr("/");
    const getStr = new pyStr("GET");
    let oldNavigation = null;

    var changePageNavigation = function(target, callback) {
        if (oldNavigation) {
            target.removeEventListener("click", oldNavigation);
        }
        oldNavigation = function(event) {
            if (event.target.matches("a")) {
                event.preventDefault();
                callback(event.target.href);
            }
            if (event.target.matches('input[type="submit"]')) {
                event.preventDefault();
                // Implement your logic here
                const closestForm = event.target.closest("form");
                const formAction = event.target.getAttribute("formaction");
                if (closestForm) {
                    const data = Object.fromEntries(new FormData(closestForm).entries());
                    console.log("Clicked!", closestForm, data);
                    callback(formAction, data);
                }
            }
        };
        target.addEventListener("click", oldNavigation);
    };

    var run_ = function(kwa, self) {
        console.log("RUN:", self, kwa);

        let bottleSiteTarget;
        try {
            bottleSiteTarget = Sk.console.drafter().html[0];
        } catch (e) {
            console.error("Couldn't load drafter in blockpy:", e);
            bottleSiteTarget = typeof Sk.BottleSiteTarget === "function" ?
            Sk.BottleSiteTarget() : document.querySelector(Sk.BottleSiteTarget);
        }
        console.log(bottleSiteTarget);
        objectSetAttr(self, rootStr, bottleSiteTarget);
        objectGetAttr(self, rootStr).innerHTML += "Apples";

        self.load_route.tp$call([self, defaultRouteStr, getStr, new pyDict([]), pyStr.$empty, pyStr.$empty]);
    };
    run_.co_kwargs = true;

    var bottleClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Has to be able to return the current latest request for bottle at this moment
            this.root = null;
            this.routes = {GET: {}, POST: {}};
            this.error_handler = {};
            return Sk.builtin.none.none$;
        });
        $loc.route = new Sk.builtin.func(function (self, path, verb, callback) {
            console.log("NEW ROUTE:", self, path, verb, callback);
            this.routes[verb.v][path.v] = callback;
        });
        $loc.error = new Sk.builtin.func(function (self, code) {
            console.log("ERROR Handler:", code);
            return new Sk.builtin.func(function(callback) {
                console.log(this.error_handler);
            });
            /*return (callback) => {
                this.error_handler[code] = callback;
            }*/
        });
        $loc.run = new Sk.builtin.func(run_);
        $loc.load_route = new Sk.builtin.func(function(self, url, method, parameters, body, headers) {
            console.log("LOAD ROUTE:", url, method, parameters, body, headers);
            //request = new Request(url, method, parameters, body, headers);
            // Figure out path
            // Turn these parameters into the ones that bottle expects
            let normalUrl = url.v;
            if (!normalUrl.startsWith("http") && !normalUrl.startsWith("file")) {
                normalUrl = "https://localhost" + normalUrl;
            }
            let fullUrl = new URL(normalUrl);
            fullUrl.searchParams.forEach((value, key) => {
                parameters.mp$ass_subscript(new pyStr(key), new pyStr(value));
            });
            //console.log(fullUrl);
            objectSetAttr(bottle.request, new pyStr("url"), new pyStr(normalUrl));
            objectSetAttr(bottle.request, new pyStr("params"), parameters);
            let pathName = fullUrl.pathname;
            /*if (fullUrl.searchParams.has("--submit-button" )) {
                pathName = fullUrl.searchParams.get("--submit-button");
            }*/
            if (!(pathName in this.routes[method.v])) {
                if (normalUrl.startsWith("http")) {
                    window.location.replace(normalUrl);
                } else {
                    throw new RuntimeError("Route not found: " + pathName);
                }
            }
            let page = this.routes[method.v][pathName].tp$call([]);
            const root = objectGetAttr(self, rootStr);
            //console.log(page);
            if (root) {
                root.innerHTML = page;
                changePageNavigation(root, (newUrl, parameters) => {
                    console.log("Page navigation begun!", newUrl);
                    self.load_route.tp$call([self, new pyStr(newUrl),
                                             getStr, Sk.ffi.remapToPy(parameters || {}), pyStr.$empty, pyStr.$empty]);
                });
            } else {
                throw new RuntimeError("Bottle has not yet started. Cannot load any pages.");
            }
        });
    };
    bottle.Bottle = Sk.misceval.buildClass(bottle, bottleClass, "Bottle", []);

    function abort(code, message) {
        // TODO: Finish the abort function
        console.error("Bottle Error:", code, message);
        alert("Bottle Error: " + code + " - " + message);
    }
    bottle.abort = new Sk.builtin.func(abort);

    function static_file(path, root, mimetype) {
        console.log("STATIC FILE:", path, root, mimetype);
    }
    bottle.static_file = new Sk.builtin.func(static_file);

    var requestClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Has to be able to return the current latest request for bottle at this moment
            objectSetAttr(self, new pyStr("url"), pyStr.$empty);

            // dictionary with pop/keys/__in__
            objectSetAttr(self, new pyStr("params"), new pyDict([]));


            this.method = "GET";
            this.path = "/";
            this.body = "";
            this.headers = {};
            return Sk.builtin.none.none$;
        });
    };
    bottle.Request = Sk.misceval.buildClass(bottle, requestClass, "BottleRequest", []);
    bottle.request = Sk.misceval.callsimArray(bottle.Request, []);

    return bottle;
}