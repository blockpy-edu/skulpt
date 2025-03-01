var STDOUT_FILENO = 1;
var STDIN_FILENO = 0;
var STDERR_FILENO = 2;

/**
 * @constructor
 * @param {Sk.builtin.str} name
 * @param {Sk.builtin.str} mode
 * @param {Object} buffering
 */
Sk.builtin.file = function (name, mode, buffering, encoding, errors, newline, closefd, opener) {
    var i;
    var elem;

    if (!(this instanceof Sk.builtin.file)) {
        return new Sk.builtin.file(name, mode, buffering);
    }

    this.mode = mode;
    this.name = Sk.ffi.remapToJs(name);
    this.buffering = Sk.ffi.remapToJs(buffering);
    this.encoding = Sk.ffi.remapToJs(encoding);
    this.errors = Sk.ffi.remapToJs(errors);
    if (Sk.builtin.checkNone(newline)) {
        this.newline = "\n";
    } else {
        this.newline = Sk.ffi.remapToJs(newline);
    }
    this.closefd = Sk.ffi.remapToJs(closefd);
    this.opener = Sk.ffi.remapToJs(opener);
    this.closed = false;

    if (this.name === "/dev/stdout") {
        this.data$ = Sk.builtin.none.none$;
        this.fileno = STDOUT_FILENO;
    } else if (this.name === "/dev/stdin") {
        this.fileno = STDIN_FILENO;
    } else if (this.name === "/dev/stderr") {
        this.fileno = STDERR_FILENO;
    } else {
        if (Sk.inBrowser) {  // todo:  Maybe provide a replaceable function for non-import files
            this.fileno = 10;
            this.data$ = Sk.inBrowser(this.name);
        } else {
            this.fileno = 11;
            this.data$ = Sk.read(name.v);
        }
        this.lineList = splitLines(this.data$, this.newline, Sk.inBrowser);
        this.currentLine = 0;
    }
    this.pos$ = 0;

	// TODONEW: Is this necessary?
    this.__class__ = Sk.builtin.file;

    if (Sk.fileopen && this.fileno >= 10) {
        Sk.fileopen(this);
    }

    return this;
};

function splitLines(text, newline, inBrowser) {
    if (newline === "") {
        newline = "\n";
    }
    let lineList = text.split(newline);
    // TODO: Find the reason why we needed this. It was part of CSV?
    if (inBrowser && lineList.length) {
        if (lineList[lineList.length-1] === "") {
            lineList = lineList.slice(0, -1);
        }
    }
    for (let i=0; i < lineList.length-1; i+= 1) {
        lineList[i] = lineList[i] + newline;
    }
    return lineList;
}

Sk.abstr.setUpInheritance("file", Sk.builtin.file, Sk.builtin.object);
Sk.abstr.setUpBuiltinMro(Sk.builtin.file);

Sk.builtin.file.prototype["$r"] = function () {
    return new Sk.builtin.str("<" +
        (this.closed ? "closed" : "open") +
        "file '" +
        this.name +
        "', mode '" +
        Sk.ffi.remapToJs(this.mode) +
        "'>");
};

Sk.builtin.file.prototype.tp$iter = function () {
    var allLines = this.lineList;
    var that = this;
    //var currentLine = this.currentLine;

    var ret =
        {
            tp$iter: function () {
                return ret;
            },
            $obj: this,
            $index: this.currentLine,
            $lines: allLines,
            tp$iternext: function () {
                if (that.currentLine >= ret.$lines.length) {
                    return undefined;
                }
                return new Sk.builtin.str(ret.$lines[that.currentLine++]);
            }
        };
    return ret;
};

Sk.abstr.setUpSlots(Sk.builtin.file);

Sk.builtin.file.prototype["__enter__"] = new Sk.builtin.func(function __enter__(self) {
    return self;
});

Sk.builtin.file.prototype["__exit__"] = new Sk.builtin.func(function __exit__(self) {
    return Sk.misceval.callsimArray(Sk.builtin.file.prototype["close"], [self]);
});



Sk.builtin.file.prototype["close"] = new Sk.builtin.func(function close(self) {
    self.closed = true;
    return Sk.builtin.none.none$;
});

Sk.builtin.file.prototype["flush"] = new Sk.builtin.func(function flush(self) {
});

Sk.builtin.file.prototype["fileno"] = new Sk.builtin.func(function fileno(self) {
    return this.fileno;
}); // > 0, not 1/2/3

Sk.builtin.file.prototype["isatty"] = new Sk.builtin.func(function isatty(self) {
    return false;
});

Sk.builtin.file.prototype["read"] = new Sk.builtin.func(function read(self, size) {
    var ret;
    var len = self.data$.length;
    var l_size;
    if (self.closed) {
        throw new Sk.builtin.ValueError("I/O operation on closed file");
    }

    if (size === undefined) {
        l_size = len;
    } else {
        l_size = Sk.ffi.remapToJs(size);
    }

    ret = new Sk.builtin.str(self.data$.substr(self.pos$, l_size));
    if (size === undefined) {
        self.pos$ = len;
    } else {
        self.pos$ += Sk.ffi.remapToJs(size);
    }
    if (self.pos$ >= len) {
        self.pos$ = len;
    }

    return ret;
});

Sk.builtin.file.$readline = function (self, size, prompt) {
    if (self.fileno === 0) {
        var x, susp;

        var lprompt = Sk.ffi.remapToJs(prompt);

        lprompt = lprompt ? lprompt : "";

        Sk.misceval.pauseTimer();
        x = Sk.inputfun(lprompt);

        if (x instanceof Promise || (x && typeof x.then === "function")) {
            susp = new Sk.misceval.Suspension();

            susp.resume = function () {
                if (susp.data.error) {
                    throw susp.data.error;
                }

                Sk.misceval.unpauseTimer();
                return new Sk.builtin.str(susp.data.result);
            };

            susp.data = {
                type: "Sk.promise",
                promise: x
            };

            return susp;
        } else {
            Sk.misceval.unpauseTimer();
            return new Sk.builtin.str(x);
        }
    } else {
        var line = "";
        if (self.currentLine < self.lineList.length) {
            line = self.lineList[self.currentLine];
            self.currentLine++;
        }
        return new Sk.builtin.str(line);
    }
};

Sk.builtin.file.prototype["readline"] = new Sk.builtin.func(function readline(self, size) {
    return Sk.builtin.file.$readline(self, size, undefined);
});

Sk.builtin.file.prototype["readlines"] = new Sk.builtin.func(function readlines(self, sizehint) {
    if (self.fileno === 0) {
        return new Sk.builtin.NotImplementedError("readlines isn't implemented because the web doesn't support Ctrl+D");
    }

    var i;
    var arr = [];
    for (i = self.currentLine; i < self.lineList.length; i++) {
        arr.push(new Sk.builtin.str(self.lineList[i]));
    }
    return new Sk.builtin.list(arr);
});

Sk.builtin.file.prototype["seek"] = new Sk.builtin.func(function seek(self, offset, whence) {
    var l_offset = Sk.ffi.remapToJs(offset);

    if (whence === undefined) {
        whence = 0;
    }
    if (whence === 0) {
        self.pos$ = l_offset;
    } else if (whence == 1) {
        self.pos$ = self.data$.length + l_offset;
    } else if (whence == 2) {
        self.pos$ = self.data$.length + l_offset;
    }

    return Sk.builtin.none.none$;
});

Sk.builtin.file.prototype["tell"] = new Sk.builtin.func(function tell(self) {
    return Sk.ffi.remapToPy(self.pos$);
});

Sk.builtin.file.prototype["truncate"] = new Sk.builtin.func(function truncate(self, size) {
    Sk.asserts.fail();
});

Sk.builtin.file.prototype["write"] = new Sk.builtin.func(function write(self, str) {
    var mode = Sk.ffi.remapToJs(self.mode);
    if (mode === "w" || mode === "wb" || mode === "a" || mode === "ab") {
        if (Sk.filewrite) {
            if (self.closed) {
                throw new Sk.builtin.ValueError("I/O operation on closed file");
            }

            if (self.fileno === 1) {
                Sk.output(Sk.ffi.remapToJs(str));
            } else {
                Sk.filewrite(self, str);
            }
        } else {
            if (self.fileno === 1) {
                Sk.output(Sk.ffi.remapToJs(str));
            } else {
                Sk.asserts.fail();
            }
        }
    } else {
        throw new Sk.builtin.IOError("File not open for writing");
    }

    return Sk.builtin.none.none$;
});


Sk.exportSymbol("Sk.builtin.file", Sk.builtin.file);
