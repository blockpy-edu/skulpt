var $builtinmodule = function (name) {
    var request = {};


    //~ Classes .................................................................

    var requestClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function (self, path, data, headers, origin_req_host, unverifiable, method) {
            self.path = path;
            self.data = data;
            self.headers = headers;
            self.origin_req_host = origin_req_host;
            self.unverifiable = unverifiable;
            self.method = method;
            return Sk.builtin.none.none$;
        });
        $loc.__init__.co_varnames = ["path", "data", "headers", "origin_req_host", "unverifiable", "method"];
        $loc.__init__.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.none.none$, Sk.builtin.bool.false$, Sk.builtin.none.none$]
    };

    request.Request =
        Sk.misceval.buildClass(request, requestClass, "Request", []);

    // Response class
    //
    // Response objects are returned by the request, get, post, etc.
    // methods, allowing the user to access the response text, status
    // code, and other information.

    // ------------------------------------------------------------
    var response = function ($gbl, $loc) {

        // ------------------------------------------------------------
        $loc.__init__ = new Sk.builtin.func(function (self, xhr) {
            self.data$ = xhr.responseText;
            self.status = xhr.status;
            self.headers = new Sk.builtin.dict([]);
            xhr.getAllResponseHeaders().split("\n").forEach(function (line) {
                var parts = line.split(": ");
                if (parts.length === 2) {
                    self.headers.mp$ass_subscript(new Sk.builtin.str(parts[0].trim()), new Sk.builtin.str(parts[1].trim()));
                }
            });
            self.closed = false;

            self.lineList = self.data$.split("\n");
            self.lineList = self.lineList.slice(0, -1);
            for (var i = 0; i < self.lineList.length; i++) {
                self.lineList[i] = self.lineList[i] + "\n";
            }
            self.currentLine = 0;
            self.pos$ = 0;
            return Sk.builtin.none.none$;
        });

        $loc.__exit__ = new Sk.builtin.func(function (self, exc_type, exc_value, exc_traceback) {
            return Sk.builtin.none.none$;
        });

        $loc.__enter__ = new Sk.builtin.func(function (self) {
            return self;
        });


        // ------------------------------------------------------------
        $loc.__str__ = new Sk.builtin.func(function (self) {
            return Sk.ffi.remapToPy("<Response>");
        });


        // ------------------------------------------------------------
        $loc.__iter__ = new Sk.builtin.func(function (self) {
            var allLines = self.lineList;

            return Sk.builtin.makeGenerator(function () {
                if (this.$index >= this.$lines.length) {
                    return undefined;
                }
                return new Sk.builtin.str(this.$lines[this.$index++]);
            }, {
                $obj: self,
                $index: 0,
                $lines: allLines
            });
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

    };

    request.Response =
        Sk.misceval.buildClass(request, response, "Response", []);


    //~ Module functions ........................................................

    // ------------------------------------------------------------
    /**
     * Constructs and sends a Request. Returns Response object.
     *
     * http://docs.python-requests.org/en/latest/api/#requests.request
     *
     * For now, this implementation doesn't actually construct a Request
     * object; it just makes the request through jQuery.ajax and then
     * constructs a Response.
     */
    request.urlopen = new Sk.builtin.func(function (req, data, timeout) {
        var prom = new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.addEventListener("loadend", function (e) {
                resolve(Sk.misceval.callsimArray(request.Response, [xmlhttp]));
            });

            var url;
            var headers = {};
            if (Sk.builtin.checkString(req)) {
                url = req.v;
            } else if (Sk.misceval.isTrue(Sk.builtin.isinstance(req, request.Request))) {
                url = req.path.v;
                req.headers.$items().forEach(([key, value]) => {
                    headers[Sk.ffi.remapToJs(key)] = Sk.ffi.remapToJs(value);
                });
            } else {
                throw new Sk.builtin.TypeError("First argument must be a string or Request object");
            }

            if (!data) {
                xmlhttp.open("GET", url);
            } else {
                xmlhttp.open("POST", url);
                // xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // TODO: Surely we cannot just data.v.length
                //xmlhttp.setRequestHeader("Content-length", data.v.length);
            }

            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xmlhttp.setRequestHeader(key, headers[key]);
                }
            }
            xmlhttp.send(data ? JSON.stringify(Sk.ffi.remapToJs(data)) : null);
        });

        var susp = new Sk.misceval.Suspension();

        susp.resume = function () {
            return resolution;
        };


        susp.data = {
            type: "Sk.promise",
            promise: prom.then(function (value) {
                console.log("URLOPEN RESOLVED", value);
                resolution = value;
                return value;
            }, function (err) {
                console.log("URLOPEN ERROR", err);
                resolution = "";
                return err;
            })
        };

        return susp;
    });
    request.urlopen.co_varnames = ["req", "data", "timeout"];
    request.urlopen.$defaults = [Sk.builtin.none.none$, Sk.builtin.none.none$];


    return request;
};
