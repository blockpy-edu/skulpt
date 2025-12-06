function combineWithCurrentPath(pathname) {
  const base = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : window.location.pathname + '/';

  const isRoot = pathname === '/' || pathname === '';
  const cleanPath = isRoot
    ? ''
    : (pathname.startsWith('/') ? pathname.slice(1) : pathname);

  return `${base}${cleanPath}${window.location.search}${window.location.hash}`;
}

function replaceHTML(tag, html) {
    // // Save current scroll position
    // const scrollTop = window.scrollY;
    // const scrollLeft = window.scrollX;

    tag.innerHTML = html;

    tag.querySelectorAll("#extra-js-container script").forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
            newScript.src = oldScript.src;  // external script
        } else {
            newScript.textContent = oldScript.textContent
                .replace(/&lt;script>/, "")
                .replace(/&lt;\/script&gt;/, "")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">"); // inline script
        }
        document.body.appendChild(newScript);
    });

    // Replace content
    // const r = document.createRange();
    // r.selectNode(tag);
    // const fragment = r.createContextualFragment(html);
    // tag.replaceChildren(fragment);

    //
    // // Restore scroll position
    // window.scrollTo(scrollLeft, scrollTop);
}


function $builtinmodule() {
    const bottle = { __name__: new Sk.builtin.str("bottle") };

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
        AttributeError,
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

    const {
        getSetDict: genericGetSetDict,
        getAttr: genericGetAttr,
        setAttr: genericSetAttr,
    } = Sk.generic;

    const bottleStr = new pyStr("bottle");
    const rootStr = new pyStr("root");
    const defaultRouteStr = new pyStr("/");
    const getStr = new pyStr("GET");
    const postStr = new pyStr("POST");
    let oldNavigation = null;

    // If Sk.bottle is not defined, create an object for it
    if (typeof Sk.bottle === "undefined") {
        Sk.bottle = {
            changeLocation(url) {
                this.servers.forEach((server) => {
                    // TODO: Accept parameters (and maybe files)
                    const args = [
                        server,
                        new pyStr(url),
                        getStr,
                        new pyDict([]),
                        pyStr.$empty,
                        pyStr.$empty,
                        new pyDict([]),
                    ];
                    return server.load_route.tp$call(args);
                });
            },
            servers: [],
        };
    }

    const changePageNavigation = function (target, callback) {
        if (oldNavigation) {
            target.removeEventListener("click", oldNavigation);
        }
        oldNavigation = function (event) {
            // If it's a download link, trigger the default behavior
            if (event.target.matches("a[download]")) {
                return;
            }
            // TODO: Should this handle external links differently?
            if (event.target.matches("a")) {
                event.preventDefault();
                return callback(event.target.href);
            }
            if (
                event.target.matches('input[type="submit"]') ||
                event.target.matches('button[type="submit"]')
            ) {
                event.preventDefault();
                const closestForm = event.target.closest("form");
                const formAction = event.target.getAttribute("formaction");
                if (closestForm) {
                    const data = Object.fromEntries(
                        new FormData(closestForm, event.target).entries()
                    );
                    console.log("Clicked!", closestForm, data, formAction, event, event.submitter);
                    return callback(formAction, data);
                }
            }
        };
        target.addEventListener("click", oldNavigation);
    };

    var run_ = function (kwa, self) {
        //console.log("RUN:", self, kwa);

        let bottleSiteTarget;
        try {
            bottleSiteTarget = Sk.console.drafter().html[0];
        } catch (e) {
            console.error("Couldn't load drafter in blockpy:", e);
            bottleSiteTarget =
                typeof Sk.BottleSiteTarget === "function"
                    ? Sk.BottleSiteTarget()
                    : document.querySelector(Sk.BottleSiteTarget);
        }
        //console.log(bottleSiteTarget);
        objectSetAttr(self, rootStr, bottleSiteTarget);
        objectGetAttr(self, rootStr).innerHTML +=
            "System failure during setup; reload, and if it persists then please contact Dr. Bart.";

        self.load_route.tp$call([
            self,
            defaultRouteStr,
            getStr,
            new pyDict([]),
            pyStr.$empty,
            pyStr.$empty,
        ]);
    };
    run_.co_kwargs = true;

    var bottleClass = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Has to be able to return the current latest request for bottle at this moment
            this.root = null;
            this.routes = { GET: {}, POST: {} };
            this.error_handler = {};
            Sk.bottle.servers.push(self);
            return Sk.builtin.none.none$;
        });
        $loc.route = new Sk.builtin.func(function (self, path, verb, callback) {
            console.log("NEW ROUTE:", self, path, verb, callback);
            this.routes[verb.v][path.v] = callback;
        });
        $loc.error = new Sk.builtin.func(function (self, code) {
            console.log("ERROR Handler:", code);
            return new Sk.builtin.func(function (callback) {
                console.log(this.error_handler);
            });
            /*return (callback) => {
                this.error_handler[code] = callback;
            }*/
        });
        $loc.run = new Sk.builtin.func(run_);
        $loc.load_route = new Sk.builtin.func(function (
            self,
            url,
            method,
            parameters,
            body,
            headers,
            files
        ) {
            console.log("LOAD ROUTE:", url, method, parameters, body, headers, files, this);
            //request = new Request(url, method, parameters, body, headers);
            // Figure out path
            // Turn these parameters into the ones that bottle expects
            let normalUrl = url.v;
            let redirected = false;
            if (!normalUrl.startsWith("http") && !normalUrl.startsWith("file")) {
                normalUrl = "https://localhost" + normalUrl;
                redirected = true;
            }
            let fullUrl = new URL(normalUrl);
            fullUrl.searchParams.forEach((value, key) => {
                const pyKey = new pyStr(key);
                console.log("KEY", key, value);
                if (parameters.mp$lookup(pyKey) === undefined) {
                    parameters.mp$ass_subscript(pyKey, new pyStr(value));
                }
            });
            objectSetAttr(bottle.request, new pyStr("url"), new pyStr(normalUrl));
            objectSetAttr(bottle.request, new pyStr("params"), parameters);
            console.log("Params", Sk.ffi.remapToJs(parameters));
            objectSetAttr(bottle.request, new pyStr("method"), method);
            if (files === undefined) {
                files = new pyDict([]);
            }
            objectSetAttr(bottle.request, new pyStr("files"), files);
            let pathName = fullUrl.pathname;
            console.log("Checking for route:", method.v, pathName, this.routes);
            if (!(pathName in this.routes[method.v])) {
                if (!redirected && (normalUrl.startsWith("http") || normalUrl.startsWith("file"))) {
                    window.location = normalUrl;
                } else {
                    throw new RuntimeError("Route not found: " + pathName);
                }
            }
            //let page = this.routes[method.v][pathName].tp$call([]);
            const routeFunction = this.routes[method.v][pathName];
            // let page = Sk.misceval.callsimOrSuspendArray(routeFunction, []);
            let createPage = () => {
                console.log("Creating page...");
                let page = Sk.misceval.callsimOrSuspendArray(routeFunction, []);
                while (page instanceof Sk.misceval.Suspension) {
                    if (!page.optional) {
                        return Sk.misceval.promiseToSuspension(
                            Sk.misceval.asyncToPromise(() => page)
                        );
                    }
                    page = page.resume();
                }
                return page;
            };
            const loadPage = (page) => {
                const root = objectGetAttr(self, rootStr);
                if (root) {
                    console.log("Updating HTML", page);
                    if (pathName === "/--about") {
                        try {
                            const newFullUrl = combineWithCurrentPath(pathName);
                            const data = {flag: "DRAFTER_LOAD_ROUTE", realLocation: url.v};
                            history.pushState(data, "", newFullUrl);
                        } catch (e) {
                            console.warn("Could not push state to history:", e);
                        }
                    } else if (pathName === "/") {
                        try {
                            let newFullUrl = window.location.pathname.endsWith("--about") ? window.location.pathname.slice(0, -("--about".length)) : window.location.pathname;
                            newFullUrl += window.location.search + window.location.hash;
                            const data = {flag: "DRAFTER_LOAD_ROUTE", realLocation: "/"};
                            history.pushState(data, "", newFullUrl);
                        } catch (e) {
                            console.warn("Could not push state to history:", e);
                        }
                    }
                    replaceHTML(root, page);
                    // root.innerHTML = page;
                    return changePageNavigation(root, (newUrl, parameters) => {
                        console.log("Page navigation begun!", newUrl, parameters);
                        const newFiles = new pyDict([]);
                        if (parameters !== undefined) {
                            Object.entries(parameters).forEach(([key, value]) => {
                                if (value instanceof File) {
                                    const newFile = Sk.misceval.callsimArray(bottle.FileUpload, [
                                        value.name,
                                        value,
                                    ]);
                                    newFiles.mp$ass_subscript(new pyStr(key), newFile);
                                    delete parameters[key];
                                }
                            });
                        }
                        const args = [
                            self,
                            new pyStr(newUrl),
                            getStr,
                            Sk.ffi.remapToPy(parameters || {}),
                            pyStr.$empty,
                            pyStr.$empty,
                            newFiles,
                        ];
                        const nextPage = self.load_route.tp$call(args);
                        return Sk.misceval.promiseToSuspension(
                            Sk.misceval.asyncToPromise(() => nextPage)
                        );
                    });
                } else {
                    throw new RuntimeError("Bottle has not yet started. Cannot load any pages.");
                }
            };
            return Sk.misceval.chain([], createPage, loadPage);
        });
    };
    bottle.Bottle = Sk.misceval.buildClass(bottle, bottleClass, "Bottle", []);

    function abort(code, message) {
        // TODO: Finish the abort function
        console.error("Bottle Error:", code, message);
        if (Sk.console && Sk.console.drafter && Sk.console.drafter.handleError) {
            Sk.console.drafter.handleError(code, message);
        } else {
            alert("Bottle Error: " + code + " - " + message);
        }
    }
    bottle.abort = new Sk.builtin.func(abort);

    function static_file(path, root, mimetype) {
        console.log("STATIC FILE:", path, root, mimetype);
    }
    bottle.static_file = new Sk.builtin.func(static_file);

    var fileClass = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, filename, fileHandle) {
            this.filename = filename;

            const fileObject = Sk.misceval.callsimArray(bottle.ReadableFile, [
                fileHandle,
                filename,
            ]);
            this.fileObject = fileObject;
            if (typeof filename === "string") {
                filename = new pyStr(filename);
            }
            objectSetAttr(self, new pyStr("file"), fileObject);
            objectSetAttr(self, new pyStr("filename"), filename);

            return Sk.builtin.none.none$;
        });
    };
    bottle.FileUpload = Sk.misceval.buildClass(bottle, fileClass, "FileUpload", []);

    var readableFile = function ($gbl, $loc) {
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
            susp.resume = function () {
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
                    // this.contents is a File object, need to read and return it
                    var reader = new FileReader();
                    reader.onload = function () {
                        console.log("READ TEXT", this.result, self.filename$);
                        const readText = new Uint8Array(this.result);
                        text = new Sk.builtin.bytes(readText);
                        resolve(text);
                    };
                    reader.readAsArrayBuffer(self.contents$);
                }),
            };
            return susp;
        });
    };
    bottle.ReadableFile = Sk.misceval.buildClass(bottle, readableFile, "ReadableFile", []);

    var requestClass = function ($gbl, $loc) {
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
