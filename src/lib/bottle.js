// Import the core bottle library (loaded globally in browser)
// The core library provides framework-agnostic functionality
// This module wraps it for Skulpt/Python integration

function $builtinmodule() {
    const bottle = {"__name__": new Sk.builtin.str("bottle")};

    // Check if BottleCore is available (should be loaded from bottle-core.js)
    if (typeof BottleCore === 'undefined') {
        throw new Error("BottleCore library not found. Make sure bottle-core.js is loaded.");
    }

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

    const bottleStr = new pyStr("bottle");
    const rootStr = new pyStr("root");
    const defaultRouteStr = new pyStr("/");
    const getStr = new pyStr("GET");
    const postStr = new pyStr("POST");

    var run_ = function(kwa, self) {
        //console.log("RUN:", self, kwa);

        let bottleSiteTarget;
        try {
            bottleSiteTarget = Sk.console.drafter().html[0];
        } catch (e) {
            console.error("Couldn't load drafter in blockpy:", e);
            bottleSiteTarget = typeof Sk.BottleSiteTarget === "function" ?
                Sk.BottleSiteTarget() : document.querySelector(Sk.BottleSiteTarget);
        }
        //console.log(bottleSiteTarget);
        objectSetAttr(self, rootStr, bottleSiteTarget);
        objectGetAttr(self, rootStr).innerHTML += "System failure during setup; reload, and if it persists than please contact Dr. Bart.";

        self.load_route.tp$call([self, defaultRouteStr, getStr, new pyDict([]), pyStr.$empty, pyStr.$empty]);
    };
    run_.co_kwargs = true;

    var bottleClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Initialize the core Bottle instance
            self.bottleCore$ = new BottleCore();
            return Sk.builtin.none.none$;
        });
        
        $loc.route = new Sk.builtin.func(function (self, path, verb, callback) {
            console.log("NEW ROUTE:", self, path, verb, callback);
            // Register route in core library
            self.bottleCore$.addRoute(path.v, verb.v, callback);
        });
        
        $loc.error = new Sk.builtin.func(function (self, code) {
            console.log("ERROR Handler:", code);
            return new Sk.builtin.func(function(callback) {
                // Register error handler in core library
                self.bottleCore$.addErrorHandler(code.v, callback);
            });
        });
        
        $loc.run = new Sk.builtin.func(run_);
        
        $loc.load_route = new Sk.builtin.func(function(self, url, method, parameters, body, headers, files) {
            console.log("LOAD ROUTE:", url, method, parameters, body, headers, files);
            
            // Parse URL using core library
            const urlInfo = self.bottleCore$.parseUrl(url.v);
            
            // Merge query parameters from URL into parameters dict
            Object.entries(urlInfo.params).forEach(([key, value]) => {
                const pyKey = new pyStr(key);
                if (parameters.mp$lookup(pyKey) === undefined) {
                    parameters.mp$ass_subscript(pyKey, new pyStr(value));
                }
            });
            
            // Update the global request object
            objectSetAttr(bottle.request, new pyStr("url"), new pyStr(urlInfo.normalUrl));
            objectSetAttr(bottle.request, new pyStr("params"), parameters);
            console.log("Params", Sk.ffi.remapToJs(parameters));
            objectSetAttr(bottle.request, new pyStr("method"), method);
            if (files === undefined) {
                files = new pyDict([]);
            }
            objectSetAttr(bottle.request, new pyStr("files"), files);
            
            // Get the route callback from core library
            const routeCallback = self.bottleCore$.routes[method.v][urlInfo.pathname];
            
            if (!routeCallback) {
                if (urlInfo.normalUrl.startsWith("http")) {
                    window.location.replace(urlInfo.normalUrl);
                } else {
                    throw new RuntimeError("Route not found: " + urlInfo.pathname);
                }
            }
            
            // Execute the route and handle the page
            let createPage = () => {
                console.log("Creating page...");
                let page = Sk.misceval.callsimOrSuspendArray(routeCallback, []);
                while (page instanceof Sk.misceval.Suspension) {
                    if (!page.optional) {
                        return Sk.misceval.promiseToSuspension(Sk.misceval.asyncToPromise(() => page));
                    }
                    page = page.resume();
                }
                return page;
            };
            
            const loadPage = (page) => {
                const root = objectGetAttr(self, rootStr);
                if (root) {
                    console.log("Updating HTML", page);
                    root.innerHTML = page;
                    
                    // Setup navigation using core library
                    const navigationCallback = (newUrl, parameters, files) => {
                        console.log("Page navigation begun!", newUrl, parameters);
                        const newFiles = new pyDict([]);
                        if (files !== undefined) {
                            Object.entries(files).forEach(([key, value]) => {
                                const newFile = Sk.misceval.callsimArray(bottle.FileUpload, [new pyStr(value.name), value]);
                                newFiles.mp$ass_subscript(new pyStr(key), newFile);
                            });
                        }
                        const args = [self, new pyStr(newUrl), getStr,
                                      Sk.ffi.remapToPy(parameters || {}),
                                      pyStr.$empty, pyStr.$empty, newFiles];
                        const nextPage = self.load_route.tp$call(args);
                        return Sk.misceval.promiseToSuspension(Sk.misceval.asyncToPromise(() => nextPage));
                    };
                    
                    self.bottleCore$.setupNavigation(root, navigationCallback);
                    return pyNone;
                } else {
                    throw new RuntimeError("Bottle has not yet started. Cannot load any pages.");
                }
            };
            return Sk.misceval.chain([], createPage, loadPage);
        });
    };
    bottle.Bottle = Sk.misceval.buildClass(bottle, bottleClass, "Bottle", []);

    function abort(code, message) {
        // Use core library for abort logic
        console.error("Bottle Error:", code, message);
        if (Sk.console && Sk.console.drafter && Sk.console.drafter.handleError) {
            Sk.console.drafter.handleError(code, message);
        } else {
            alert("Bottle Error: " + code + " - " + message);
        }
    }
    bottle.abort = new Sk.builtin.func(abort);

    function static_file(path, root, mimetype) {
        // Use core library for static file logic
        BottleUtils.staticFile(path.v, root.v, mimetype ? mimetype.v : undefined);
    }
    bottle.static_file = new Sk.builtin.func(static_file);

    var fileClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, filename, fileHandle) {
            console.log("NEW FILE:", filename);
            self.filename$ = filename;
            self.fileHandle$ = fileHandle;

            const fileObject = Sk.misceval.callsimArray(bottle.ReadableFile, [fileHandle, filename]);
            self.fileObject$ = fileObject;
            objectSetAttr(self, new pyStr("file"), fileObject);
            objectSetAttr(self, new pyStr("filename"), filename);

            return Sk.builtin.none.none$;
        });
    };
    bottle.FileUpload = Sk.misceval.buildClass(bottle, fileClass, "FileUpload", []);

    var readableFile = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, contents, filename) {
            self.contents$ = contents;
            self.filename$ = filename;
            objectSetAttr(self, new pyStr("filename"), filename);
            return Sk.builtin.none.none$;
        });
        $loc.seek = new Sk.builtin.func(function (self, offset, whence) {
            return Sk.builtin.none.none$;
        });
        $loc.read = new Sk.builtin.func(function (self) {
            console.log("STARTING READ", self, self.filename$);
            const susp = new Sk.misceval.Suspension();
            let text = new Sk.builtin.bytes();
            susp.resume = function() {
                console.log("RESUMED READ", text, self.filename$);
                if (susp.data["error"]) {
                    throw susp.data["error"];
                } else {
                    return text;
                }
            };
            susp.data = {
                type: "Sk.promise",
                promise: new Promise((resolve) => {
                    // Use FileUploadCore for file reading
                    const fileUpload = new FileUploadCore(
                        self.filename$ ? self.filename$.v : "unknown", 
                        self.contents$
                    );
                    fileUpload.read().then((bytes) => {
                        text = new Sk.builtin.bytes(bytes);
                        resolve(text);
                    }).catch((error) => {
                        susp.data["error"] = error;
                        resolve(null);
                    });
                })
            };
            return susp;
        });
    };
    bottle.ReadableFile = Sk.misceval.buildClass(bottle, readableFile, "ReadableFile", []);

    var requestClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Has to be able to return the current latest request for bottle at this moment
            objectSetAttr(self, new pyStr("url"), pyStr.$empty);

            // dictionary with pop/keys/__in__
            objectSetAttr(self, new pyStr("params"), new pyDict([]));

            objectSetAttr(self, new pyStr("method"), getStr);

            objectSetAttr(self, new pyStr("files"), new pyDict([]));
            console.log("MAKING REQUEST", this, self);


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