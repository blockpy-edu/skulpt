// eslint-disable-next-line no-unused-vars
const $builtinmodule = function (name) {
    const { str: pyStr } = Sk.builtin;

    const request = { __name__: new pyStr("requests") };

    //~ Classes .................................................................

    // Response class
    //
    // Response objects are returned by the request, get, post, etc.
    // methods, allowing the user to access the response text, status
    // code, and other information.

    // ------------------------------------------------------------
    request.Response = Sk.abstr.buildNativeClass("requests.Response", {
        constructor: function(data, status_code, headers, url, method) {

        }
    })
    var response = function ($gbl, $loc) {
        // ------------------------------------------------------------
        $loc.__init__ = new Sk.builtin.func(function (
            self,
            data,
            status_code,
            headers,
            url,
            method
        ) {
            // Convert Python strings to JavaScript strings
            self.data$ = typeof data === "string" ? data : Sk.ffi.remapToJs(data);
            self.lineList = self.data$.split("\n");
            self.lineList = self.lineList.slice(0, -1);
            for (var i = 0; i < self.lineList.length; i++) {
                self.lineList[i] = self.lineList[i] + "\n";
            }
            self.currentLine = 0;
            self.pos$ = 0;

            // Convert parameters to JavaScript if needed
            var jsStatusCode =
                status_code !== undefined
                    ? typeof status_code === "number"
                        ? status_code
                        : Sk.ffi.remapToJs(status_code)
                    : 200;
            var jsHeaders =
                headers !== undefined
                    ? typeof headers === "object" && !headers.constructor.$isPyWrapped
                        ? headers
                        : Sk.ffi.remapToJs(headers)
                    : {};
            var jsUrl =
                url !== undefined ? (typeof url === "string" ? url : Sk.ffi.remapToJs(url)) : "";

            // Set response attributes
            Sk.abstr.sattr(self, new Sk.builtin.str("text"), Sk.ffi.remapToPy(self.data$), true);
            Sk.abstr.sattr(self, new Sk.builtin.str("content"), Sk.ffi.remapToPy(self.data$), true);
            Sk.abstr.sattr(
                self,
                new Sk.builtin.str("status_code"),
                Sk.ffi.remapToPy(jsStatusCode),
                true
            );
            Sk.abstr.sattr(self, new Sk.builtin.str("headers"), Sk.ffi.remapToPy(jsHeaders), true);
            Sk.abstr.sattr(self, new Sk.builtin.str("url"), Sk.ffi.remapToPy(jsUrl), true);
            Sk.abstr.sattr(self, new Sk.builtin.str("encoding"), Sk.ffi.remapToPy("utf-8"), true);
            Sk.abstr.sattr(self, new Sk.builtin.str("cookies"), Sk.ffi.remapToPy({}), true);
            Sk.abstr.sattr(self, new Sk.builtin.str("history"), Sk.ffi.remapToPy([]), true);

            // Set reason based on status code
            var reason = "OK";
            if (jsStatusCode !== undefined) {
                var statusReasons = {
                    200: "OK",
                    201: "Created",
                    202: "Accepted",
                    204: "No Content",
                    301: "Moved Permanently",
                    302: "Found",
                    304: "Not Modified",
                    400: "Bad Request",
                    401: "Unauthorized",
                    403: "Forbidden",
                    404: "Not Found",
                    500: "Internal Server Error",
                    502: "Bad Gateway",
                    503: "Service Unavailable",
                };
                reason = statusReasons[jsStatusCode] || "Unknown";
            }
            Sk.abstr.sattr(self, new Sk.builtin.str("reason"), Sk.ffi.remapToPy(reason), true);

            // ok property - True if status_code is less than 400
            var ok = jsStatusCode < 400;
            Sk.abstr.sattr(self, new Sk.builtin.str("ok"), Sk.ffi.remapToPy(ok), true);

            return Sk.builtin.none.none$;
        });

        // ------------------------------------------------------------
        $loc.__str__ = new Sk.builtin.func(function (self) {
            var status = Sk.ffi.remapToJs(Sk.abstr.gattr(self, new Sk.builtin.str("status_code")));
            return Sk.ffi.remapToPy("<Response [" + status + "]>");
        });

        $loc.__repr__ = $loc.__str__;

        // ------------------------------------------------------------
        $loc.__iter__ = new Sk.builtin.func(function (self) {
            var allLines = self.lineList;

            return Sk.builtin.makeGenerator(
                function () {
                    if (this.$index >= this.$lines.length) {
                        return undefined;
                    }
                    return new Sk.builtin.str(this.$lines[this.$index++]);
                },
                {
                    $obj: self,
                    $index: 0,
                    $lines: allLines,
                }
            );
        });

        // ------------------------------------------------------------
        $loc.read = new Sk.builtin.func(function (self, size) {
            if (self.closed) {
                throw new Sk.builtin.ValueError("I/O operation on closed file");
            }
            var len = self.data$.length;
            if (size === undefined) {
                size = len;
            }
            var ret = new Sk.builtin.str(self.data$.substr(self.pos$, size));
            self.pos$ += size;
            if (self.pos$ >= len) {
                self.pos$ = len;
            }
            return ret;
        });

        // ------------------------------------------------------------
        $loc.readline = new Sk.builtin.func(function (self, size) {
            var line = "";
            if (self.currentLine < self.lineList.length) {
                line = self.lineList[self.currentLine];
                self.currentLine++;
            }
            return new Sk.builtin.str(line);
        });

        // ------------------------------------------------------------
        $loc.readlines = new Sk.builtin.func(function (self, sizehint) {
            var arr = [];
            for (var i = self.currentLine; i < self.lineList.length; i++) {
                arr.push(new Sk.builtin.str(self.lineList[i]));
            }
            return new Sk.builtin.list(arr);
        });

        // ------------------------------------------------------------
        $loc.json = new Sk.builtin.func(function (self) {
            return Sk.ffi.remapToPy(JSON.parse(self.data$));
        });

        // ------------------------------------------------------------
        $loc.raise_for_status = new Sk.builtin.func(function (self) {
            var status_code = Sk.ffi.remapToJs(
                Sk.abstr.gattr(self, new Sk.builtin.str("status_code"))
            );
            if (status_code >= 400) {
                var reason = Sk.ffi.remapToJs(Sk.abstr.gattr(self, new Sk.builtin.str("reason")));
                var url = Sk.ffi.remapToJs(Sk.abstr.gattr(self, new Sk.builtin.str("url")));
                var msg = status_code + " " + reason + " for url: " + url;
                throw new Sk.builtin.Exception(msg);
            }
            return Sk.builtin.none.none$;
        });

        // ------------------------------------------------------------
        $loc.iter_content = new Sk.builtin.func(function (self, kw) {
            // Extract chunk_size from kwargs or use default
            var chunk_size = 1;
            if (kw && kw.chunk_size !== undefined) {
                chunk_size = Sk.ffi.remapToJs(kw.chunk_size);
            } else if (arguments.length > 1 && typeof arguments[1] !== "object") {
                // Positional argument
                chunk_size = Sk.ffi.remapToJs(arguments[1]);
            }

            var data = self.data$;
            var index = 0;

            return Sk.builtin.makeGenerator(
                function () {
                    if (index >= data.length) {
                        return undefined;
                    }
                    var chunk = data.substr(index, chunk_size);
                    index += chunk_size;
                    return new Sk.builtin.str(chunk);
                },
                {
                    $obj: self,
                    $index: index,
                    $data: data,
                    $chunk_size: chunk_size,
                }
            );
        });
        $loc.iter_content.co_kwargs = true;

        // ------------------------------------------------------------
        $loc.iter_lines = new Sk.builtin.func(function (self, chunk_size, decode_unicode) {
            var allLines = self.lineList;

            return Sk.builtin.makeGenerator(
                function () {
                    if (this.$index >= this.$lines.length) {
                        return undefined;
                    }
                    var line = this.$lines[this.$index++];
                    // Remove trailing newline for iter_lines
                    if (line.endsWith("\n")) {
                        line = line.slice(0, -1);
                    }
                    return new Sk.builtin.str(line);
                },
                {
                    $obj: self,
                    $index: 0,
                    $lines: allLines,
                }
            );
        });
    };

    request.Response = Sk.misceval.buildClass(request, response, "Response", []);

    //~ Exception classes .......................................................

    // Base exception class for requests
    var RequestException = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, message) {
            Sk.builtin.Exception.prototype.__init__.apply(self, [message]);
        });
    };
    request.RequestException = Sk.misceval.buildClass(
        request,
        RequestException,
        "RequestException",
        [Sk.builtin.Exception]
    );

    // HTTP Error
    var HTTPError = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, message) {
            Sk.builtin.Exception.prototype.__init__.apply(self, [message]);
        });
    };
    request.HTTPError = Sk.misceval.buildClass(request, HTTPError, "HTTPError", [
        request.RequestException,
    ]);

    // Connection Error
    var ConnectionError = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, message) {
            Sk.builtin.Exception.prototype.__init__.apply(self, [message]);
        });
    };
    request.ConnectionError = Sk.misceval.buildClass(request, ConnectionError, "ConnectionError", [
        request.RequestException,
    ]);

    // Timeout
    var Timeout = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, message) {
            Sk.builtin.Exception.prototype.__init__.apply(self, [message]);
        });
    };
    request.Timeout = Sk.misceval.buildClass(request, Timeout, "Timeout", [
        request.RequestException,
    ]);

    // TooManyRedirects
    var TooManyRedirects = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, message) {
            Sk.builtin.Exception.prototype.__init__.apply(self, [message]);
        });
    };
    request.TooManyRedirects = Sk.misceval.buildClass(
        request,
        TooManyRedirects,
        "TooManyRedirects",
        [request.RequestException]
    );

    //~ Module functions ........................................................

    // ------------------------------------------------------------
    /**
     * Constructs and sends a Request. Returns Response object.
     *
     * http://docs.python-requests.org/en/latest/api/#requests.request
     *
     * Supports various HTTP methods and request parameters including:
     * - params: URL parameters
     * - data: request body data
     * - json: JSON data (automatically sets content-type)
     * - headers: custom headers
     * - timeout: request timeout
     */
    const request_f = function (method, url, kw) {
        // Extract keyword arguments
        var params = kw && kw.params !== undefined ? kw.params : undefined;
        var data = kw && kw.data !== undefined ? kw.data : undefined;
        var json_data = kw && kw.json !== undefined ? kw.json : undefined;
        var headers = kw && kw.headers !== undefined ? kw.headers : undefined;
        var timeout = kw && kw.timeout !== undefined ? kw.timeout : undefined;
        var cookies = kw && kw.cookies !== undefined ? kw.cookies : undefined;
        var allow_redirects = kw && kw.allow_redirects !== undefined ? kw.allow_redirects : true;

        // Convert method to uppercase JavaScript string
        method = Sk.ffi.remapToJs(method).toUpperCase();
        var urlStr = Sk.ffi.remapToJs(url);

        // Build URL with params if provided
        if (params !== undefined) {
            var paramsObj = Sk.ffi.remapToJs(params);
            var queryString = Object.keys(paramsObj)
                .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(paramsObj[key]))
                .join("&");
            if (queryString) {
                urlStr += (urlStr.indexOf("?") === -1 ? "?" : "&") + queryString;
            }
        }

        // If mocked data is available, use it
        if (Sk.requestsGet) {
            var responseData = Sk.requestsGet(urlStr, data, timeout);
            return Sk.misceval.callsim(request.Response, responseData, 200, {}, urlStr, method);
        }

        var prom = new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();

            // Set up timeout if specified
            if (timeout !== undefined) {
                xmlhttp.timeout = Sk.ffi.remapToJs(timeout) * 1000; // Convert to milliseconds
                xmlhttp.ontimeout = function () {
                    reject(new Error("Request timeout"));
                };
            }

            xmlhttp.addEventListener("loadend", function (e) {
                var responseHeaders = {};
                var headerStr = xmlhttp.getAllResponseHeaders();
                if (headerStr) {
                    var headerPairs = headerStr.trim().split(/[\r\n]+/);
                    headerPairs.forEach(function (line) {
                        var parts = line.split(": ");
                        var header = parts.shift();
                        var value = parts.join(": ");
                        responseHeaders[header] = value;
                    });
                }

                resolve(
                    Sk.misceval.callsim(
                        request.Response,
                        xmlhttp.responseText,
                        xmlhttp.status,
                        responseHeaders,
                        urlStr,
                        method
                    )
                );
            });

            xmlhttp.addEventListener("error", function (e) {
                reject(new Error("Connection error"));
            });

            console.log("Making request:", method, url);
            xmlhttp.open(method, urlStr);

            // Set headers
            var headersObj = headers !== undefined ? Sk.ffi.remapToJs(headers) : {};

            // Handle JSON data
            var requestBody = null;
            if (json_data !== undefined) {
                requestBody = JSON.stringify(Sk.ffi.remapToJs(json_data));
                headersObj["Content-Type"] = "application/json";
            } else if (data !== undefined) {
                requestBody = Sk.ffi.remapToJs(data);
                if (typeof requestBody === "object") {
                    // Convert object to form-encoded string
                    requestBody = Object.keys(requestBody)
                        .map(
                            (key) =>
                                encodeURIComponent(key) + "=" + encodeURIComponent(requestBody[key])
                        )
                        .join("&");
                    headersObj["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }

            // Set all headers
            Object.keys(headersObj).forEach(function (key) {
                xmlhttp.setRequestHeader(key, headersObj[key]);
            });

            // Set cookies if provided
            if (cookies !== undefined) {
                var cookiesObj = Sk.ffi.remapToJs(cookies);
                var cookieStr = Object.keys(cookiesObj)
                    .map((key) => key + "=" + cookiesObj[key])
                    .join("; ");
                if (cookieStr) {
                    xmlhttp.setRequestHeader("Cookie", cookieStr);
                }
            }

            xmlhttp.send(requestBody);
        });

        var susp = new Sk.misceval.Suspension();

        susp.resume = function () {
            if (susp.data["error"]) {
                throw susp.data["error"];
            } else {
                return resolution;
            }
        };

        susp.data = {
            type: "Sk.promise",
            promise: prom.then(
                function (value) {
                    resolution = value;
                    return value;
                },
                function (err) {
                    console.log("Request error:", err);
                    // Throw appropriate exception type
                    if (err.message === "Request timeout") {
                        throw new Sk.builtin.Exception("Timeout: " + err.message);
                    } else if (err.message === "Connection error") {
                        throw new Sk.builtin.Exception("ConnectionError: " + err.message);
                    }
                    return Promise.reject(err);
                }
            ),
        };

        return susp;
    };
    request_f.co_kwargs = true;
    request.request = new Sk.builtin.func(request_f);

    // Wrapper functions for different HTTP methods
    const get_f = function (kwa) {
        Sk.builtin.pyCheckArgs("url", arguments, 1, Infinity, true, false);
        const args = Array.prototype.slice.call(arguments, 1);
        const url = Sk.ffi.remapToJs(args[0]);
        return request_f(new Sk.builtin.str("GET"), url, kwa);
    };
    get_f.co_kwargs = true;
    request.get = new Sk.builtin.func(get_f);

    const post_f = function (url, kw) {
        return request_f(new Sk.builtin.str("POST"), url, kw);
    };
    post_f.co_kwargs = true;
    request.post = new Sk.builtin.func(post_f);

    const put_f = function (url, kw) {
        return request_f(new Sk.builtin.str("PUT"), url, kw);
    };
    put_f.co_kwargs = true;
    request.put = new Sk.builtin.func(put_f);

    const delete_f = function (url, kw) {
        return request_f(new Sk.builtin.str("DELETE"), url, kw);
    };
    delete_f.co_kwargs = true;
    // Use both property syntaxes to ensure accessibility
    request["delete"] = new Sk.builtin.func(delete_f);
    request.$delete = request["delete"];

    const head_f = function (url, kw) {
        return request_f(new Sk.builtin.str("HEAD"), url, kw);
    };
    head_f.co_kwargs = true;
    request.head = new Sk.builtin.func(head_f);

    const options_f = function (url, kw) {
        return request_f(new Sk.builtin.str("OPTIONS"), url, kw);
    };
    options_f.co_kwargs = true;
    request.options = new Sk.builtin.func(options_f);

    const patch_f = function (url, kw) {
        return request_f(new Sk.builtin.str("PATCH"), url, kw);
    };
    patch_f.co_kwargs = true;
    request.patch = new Sk.builtin.func(patch_f);

    //~ Session class ...........................................................

    var session = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self) {
            // Store session-level defaults
            self.headers$ = {};
            self.cookies$ = {};
            self.params$ = {};
            return Sk.builtin.none.none$;
        });

        $loc.request = new Sk.builtin.func(function (self, method, url, kw) {
            // Merge session defaults with request-specific parameters
            kw = kw || {};

            // Merge headers
            if (kw.headers === undefined) {
                kw.headers = Sk.ffi.remapToPy(self.headers$);
            } else {
                var mergedHeaders = Object.assign({}, self.headers$, Sk.ffi.remapToJs(kw.headers));
                kw.headers = Sk.ffi.remapToPy(mergedHeaders);
            }

            // Merge cookies
            if (kw.cookies === undefined) {
                kw.cookies = Sk.ffi.remapToPy(self.cookies$);
            } else {
                var mergedCookies = Object.assign({}, self.cookies$, Sk.ffi.remapToJs(kw.cookies));
                kw.cookies = Sk.ffi.remapToPy(mergedCookies);
            }

            // Merge params
            if (kw.params === undefined) {
                kw.params = Sk.ffi.remapToPy(self.params$);
            } else {
                var mergedParams = Object.assign({}, self.params$, Sk.ffi.remapToJs(kw.params));
                kw.params = Sk.ffi.remapToPy(mergedParams);
            }

            return request_f(method, url, kw);
        });
        $loc.request.co_kwargs = true;

        $loc.get = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("GET"), url]
            );
        });
        $loc.get.co_kwargs = true;

        $loc.post = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("POST"), url]
            );
        });
        $loc.post.co_kwargs = true;

        $loc.put = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("PUT"), url]
            );
        });
        $loc.put.co_kwargs = true;

        $loc["delete"] = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("DELETE"), url]
            );
        });
        $loc["delete"].co_kwargs = true;

        $loc.head = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("HEAD"), url]
            );
        });
        $loc.head.co_kwargs = true;

        $loc.options = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("OPTIONS"), url]
            );
        });
        $loc.options.co_kwargs = true;

        $loc.patch = new Sk.builtin.func(function (self, url, kw) {
            return Sk.misceval.apply(
                Sk.abstr.gattr(self, new Sk.builtin.str("request")),
                undefined,
                undefined,
                kw,
                [new Sk.builtin.str("PATCH"), url]
            );
        });
        $loc.patch.co_kwargs = true;

        $loc.close = new Sk.builtin.func(function (self) {
            // Clean up session resources
            self.headers$ = {};
            self.cookies$ = {};
            self.params$ = {};
            return Sk.builtin.none.none$;
        });
    };

    request.Session = Sk.misceval.buildClass(request, session, "Session", []);

    // Convenience function to create a session
    request.session = new Sk.builtin.func(function () {
        return Sk.misceval.callsim(request.Session);
    });

    return request;
};
