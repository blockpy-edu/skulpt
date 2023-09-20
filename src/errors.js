/*
 * The filename, line number, and column number of exceptions are
 * stored within the exception object.  Note that not all exceptions
 * clearly report the column number.  To customize the exception
 * message to use any/all of these fields, you can either modify
 * tp$str below to print the desired message, or use them in the
 * skulpt wrapper (i.e., runit) to present the exception message.
 */



/**
 * @constructor
 * @param {...} args Typically called with a single string argument
 */
const BaseException = Sk.abstr.buildNativeClass("BaseException", {
    constructor: function BaseException(arg, ...tb) {
        // internally args is either a string
        Sk.asserts.assert(this instanceof BaseException, "bad call to exception constructor, use 'new'");
        // for all internal calls only the first argument is included in args
        if (typeof arg === "string") {
            arg = new Sk.builtin.str(arg);
        }
        this.args = new Sk.builtin.tuple(arg ? [arg] : []);
        // if we have tb args then it's an internal call indicating the pre instantiated traceback
        // we should probably change this at some point because this only happens with SyntaxErrors
        this.traceback = tb.length >= 2 ? [{ filename: tb[0] || "<unknown>", text: tb[1], lineno: tb[2] }] : [];
        this._full_traceback = tb;
        this.feedback = Sk.builtin.none.none$;
        this.__cause__ = Sk.builtin.none.none$;
        this.__context__ = Sk.builtin.none.none$;
        this.__suppress_context__ = Sk.builtin.none.none$;
        this.$d = new Sk.builtin.dict();
    },
    slots: /**@lends {BaseException}*/ {
        tp$getattr: Sk.generic.getAttr,
        tp$doc: "Common base class for all exceptions",
        tp$new: BaseExc_new,
        tp$init: BaseExc_init,
        $r() {
            let ret = this.tp$name;
            ret += "(" + this.args.v.map((x) => Sk.misceval.objectRepr(x)).join(", ") + ")";
            return new Sk.builtin.str(ret);
        },
        tp$str: BaseExc_str,
    },
    getsets: /**@lends {BaseException}*/ {
        args: {
            $get() {
                return this.args;
            },
            $set(v) {
                checkDeleting(v, "args");
                this.args = new Sk.builtin.tuple(v);
            },
        },
        __dict__: Sk.generic.getSetDict,	
        __cause__: {
            $get: function () { return this.__cause__; },
            $set: function(v) { this.__cause__ = v; }
        },
        feedback: {
            $get: function () { return this.feedback; },
            $set: function(v) { this.feedback = v; }
        },
        __context__: {
            $get: function () { return this.__context__; },
            $set: function(v) { this.__context__ = v; }
        },
        __suppress_context__: {
            $get: function () { return this.__suppress_context__; },
            $set: function(v) { this.__suppress_context__ = v; }
        }
    },
    proto: /**@lends {BaseException}*/ {
        toString() {
            let ret = this.tp$name;
            ret += ": " + this.tp$str().v;

            if (this.traceback.length !== 0) {
                ret += " on line " + this.traceback[0].lineno;
            } else {
                ret += " at <unknown>";
            }

            if (this.args.v.length > 4) {
                ret += "\n" + this.args.v[4].v + "\n";
                for (let i = 0; i < this.args.v[3]; ++i) {
                    ret += " ";
                }
                ret += "^\n";
            }

            return ret;
        }
    }
});

// will be used when we implement other getsets
function checkDeleting(v, name) {
    if (v === undefined) {
        throw new Sk.builtin.TypeError(`${name} may not be deleted`);
    }
}

function BaseExc_new(args, kws) {
    const instance = new this.constructor();
    if (this.ht$type) {
        BaseException.call(instance);
    }
    // called from python so do the args here
    instance.args = new Sk.builtin.tuple(args.slice(0));
    return instance;
}

function BaseExc_init(args, kws) {
    Sk.abstr.checkNoKwargs(Sk.abstr.typeName(this), kws);
    this.args = new Sk.builtin.tuple(args.slice(0));
}

function BaseExc_str() {
    if (this.args.v.length <= 1) {
        return new Sk.builtin.str(this.args.v[0]);
    }
    return this.args.$r();
}

function complexExtends(base, name, doc, init, descriptors, str) {
    descriptors || (descriptors = []);
    const flags = init ? {} : { sk$solidBase: false };
    const slots = { tp$init: init || BaseExc_init, tp$doc: doc };
    if (str) {
        slots.tp$str = str;
    }

    return Sk.abstr.buildNativeClass(name, {
        base,
        constructor: function pyExc(...args) {
            base.apply(this, args);
            descriptors.forEach((getset, i) => {
                this["$" + getset] = Sk.ffi.remapToPy(args[i]);
            });
        },
        slots,
        getsets: Object.fromEntries(
            descriptors.map((getset) => [
                getset,
                {
                    $get() {
                        return this["$" + getset] || Sk.builtin.none.none$;
                    },
                    $set(v) {
                        this["$" + getset] = v || Sk.builtin.none.none$;
                    },
                },
            ])
        ),
        flags,
    });
}

function simpleExtends(base, name, doc) {
    const tp$init = base.prototype.tp$init;
    const slots = { tp$doc: doc, tp$init };
    if (tp$init === BaseExc_init) {
        slots.tp$new = BaseExc_new;
    }
    return Sk.abstr.buildNativeClass(name, {
        base,
        constructor: function pyExc(...args) {
            base.apply(this, args);
        },
        slots,
        flags: {
            sk$solidBase: false,
        },
    });
}

const SystemExit = simpleExtends(BaseException, "SystemExit", "Request to exit from the interpreter.");
const KeyboardInterrupt = simpleExtends(BaseException, "KeyboardInterrupt", "Program interrupted by user.");
const GeneratorExit = simpleExtends(BaseException, "GeneratorExit", "Request that a generator exit.");

const Exception = simpleExtends(BaseException, "Exception", "Common base class for all non-exit exceptions.");

const StopIteration = complexExtends(
    Exception,
    "StopIteration",
    "Signal the end from iterator.__next__().",
    function init(args, kws) {
        BaseExc_init.call(this, args, kws);
        this.$value = args[0] || Sk.builtin.none.none$;
    },
    ["value"]
);

const StopAsyncIteration = simpleExtends(Exception, "StopAsyncIteration", "Signal the end from iterator.__anext__().");

const ArithmeticError = simpleExtends(Exception, "ArithmeticError", "Base class for arithmetic errors.");
const FloatingPointError = simpleExtends(ArithmeticError, "FloatingPointError", "Floating point operation failed.");
const OverflowError = simpleExtends(ArithmeticError, "OverflowError", "Result too large to be represented.");
const ZeroDivisionError = simpleExtends(
    ArithmeticError,
    "ZeroDivisionError",
    "Second argument to a division or modulo operation was zero."
);
const AssertionError = simpleExtends(Exception, "AssertionError", "Assertion failed.");
const AttributeError = simpleExtends(Exception, "AttributeError", "Attribute not found.");
const BufferError = simpleExtends(Exception, "BufferError", "Buffer error.");
const EOFError = simpleExtends(Exception, "EOFError", "Read beyond end of file.");

const ImportError = complexExtends(
    Exception,
    "ImportError",
    "Import can't find module, or can't find name in module.",
    function init(args, kws) {
        BaseExc_init.call(this, args);
        const [name, path] = Sk.abstr.copyKeywordsToNamedArgs("ImportError", ["name", "path"], [], kws);
        this.$name = name;
        this.$path = path;
        if (args.length === 1) {
            this.$msg = args[0];
        }
    },
    ["msg", "name", "path"],
    function str() {
        if (Sk.builtin.checkString(this.$msg)) {
            return this.$msg;
        }
        return BaseExc_str.call(this);
    }
);

const ModuleNotFoundError = simpleExtends(ImportError, "ModuleNotFoundError", "Module not found.");

const LookupError = simpleExtends(Exception, "LookupError", "Base class for lookup errors.");
const IndexError = simpleExtends(LookupError, "IndexError", "Sequence index out of range.");
const KeyError = complexExtends(LookupError, "KeyError", "Mapping key not found.", null, null, function str() {
    if (this.args.v.length === 1) {
        return this.args.v[0].$r(); // prevents printing an empty string
    }
    return BaseExc_str.call(this);
});

const MemoryError = simpleExtends(Exception, "MemoryError", "Out of memory.");

const NameError = simpleExtends(Exception, "NameError", "Name not found globally.");
const UnboundLocalError = simpleExtends(
    NameError,
    "UnboundLocalError",
    "Local name referenced but not bound to a value."
);

const OSError = complexExtends(Exception, "OSError", "Base class for I/O related errors.", function (args, kws) {
    BaseExc_init.call(this, args, kws);
});
// const BlockingIOError = simpleExtends(OSError, "BlockingIOError", "I/O operation would block.");
// const ChildProcessError = simpleExtends(OSError, "ChildProcessError", "Child process error.");
// const ConnectionError = simpleExtends(OSError, "ConnectionError", "Connection error.");
// const BrokenPipeError = simpleExtends(ConnectionError, "BrokenPipeError", "Broken pipe.");
// const ConnectionAbortedError = simpleExtends(ConnectionError, "ConnectionAbortedError", "Connection aborted.");
// const ConnectionRefusedError = simpleExtends(ConnectionError, "ConnectionRefusedError", "Connection refused.");
// const ConnectionResetError = simpleExtends(ConnectionError, "ConnectionResetError", "Connection reset.");
// const FileExistsError = simpleExtends(OSError, "FileExistsError", "File already exists.");
const FileNotFoundError = simpleExtends(OSError, "FileNotFoundError", "File not found.");
// const InterruptedError = simpleExtends(OSError, "InterruptedError", "Interrupted by signal.");
// const IsADirectoryError = simpleExtends(OSError, "IsADirectoryError", "Operation doesn't work on directories.");
// const NotADirectoryError = simpleExtends(OSError, "NotADirectoryError", "Operation only works on directories.");
// const PermissionError = simpleExtends(OSError, "PermissionError", "Not enough permissions.");
// const ProcessLookupError = simpleExtends(OSError, "ProcessLookupError", "Process not found.");
const TimeoutError = simpleExtends(OSError, "TimeoutError", "Timeout expired.");

const ReferenceError = simpleExtends(Exception, "ReferenceError", "Weak ref proxy used after referent went away.");

const RuntimeError = simpleExtends(Exception, "RuntimeError", "Unspecified run-time error.");
const NotImplementedError = simpleExtends(
    RuntimeError,
    "NotImplementedError",
    "Method or function hasn't been implemented yet."
);
const RecursionError = simpleExtends(RuntimeError, "RecursionError", "Recursion limit exceeded.");

const SyntaxError = complexExtends(
    Exception,
    "SyntaxError",
    "Invalid syntax.",
    function init(args, kws) {
        // TODO: this doesn't actually get called any more??
        BaseExc_init.call(this, args, kws);
        if (args.length >= 1) {
            this.$msg = args[0];
        }
        if (args.length === 2) {
            const info = new Sk.builtin.tuple(args[1]).v;
            this.$filename = info[0];
            this.$lineno = info[1];
            //console.debug(this, info);
            // if info[2] is an array, then we break it up
            if (Array.isArray(info[2].v)) {
                if (Array.isArray(info[2].v[0].v)) {
                    // Nested array?
                    this.$offset = info[2].v[0].v[1];
                    this.$end_lineno = info[2].v[1].v[0];
                    this.$end_offset = info[2].v[1].v[1];
                } else {
                    // Flat array
                    this.$offset = info[2].v[1];
                    this.$end_lineno = info[2].v[2];
                    this.$end_offset = info[2].v[3];
                }
            } else {
                this.$offset = info[2];
                this.$end_lineno = info[1];
                this.$end_offset = info[2];
            }
            /*this.$offset = info[2].v[0].v[1];
            this.$end_lineno = info[2].v[1].v[0];
            this.$end_offset = info[2].v[1].v[1];*/
            this.$text = info[3];
            // TODO: acbart this just makes the traceback work for now, not actually getting the data yet
        }
    },
    ["msg", "filename", "text", "lineno", "offset", "end_lineno", "end_offset" /*"print_file_and_line"*/],
    function str() {
        return BaseExc_str.call(this);
    }
);
const IndentationError = simpleExtends(SyntaxError, "IndentationError", "Improper indentation.");
const TabError = simpleExtends(IndentationError, "TabError", "Improper mixture of spaces and tabs.");

const SystemError = simpleExtends(Exception, "SystemError", "Internal error in the Skulpt interpreter.");

const TypeError = simpleExtends(Exception, "TypeError", "Inappropriate argument type.");
const ValueError = simpleExtends(Exception, "ValueError", "Inappropriate argument value (of correct type).");

const UnicodeError = simpleExtends(ValueError, "UnicodeError", "Unicode related error.");
// these have some extra args - for now just keep them as simple extends
const UnicodeDecodeError = simpleExtends(UnicodeError, "UnicodeDecodeError", "Unicode decoding error.");
const UnicodeEncodeError = simpleExtends(UnicodeError, "UnicodeEncodeError", "Unicode encoding error.");
// const UnicodeTranslateError = simpleExtends(UnicodeError, "UnicodeTranslateError", "Unicode translation error.");

/**@todo we should support warnings */
// const Warning = simpleExtends(Exception, "Warning", "Base class for warning categories.");
// const DeprecationWarning = simpleExtends(Warning, "DeprecationWarning", "Base class for warnings about deprecated features.");
// const PendingDeprecationWarning = simpleExtends(Warning, "PendingDeprecationWarning", "Base class for warnings about features which will be deprecated\nin the future.");
// const RuntimeWarning = simpleExtends(Warning, "RuntimeWarning", "Base class for warnings about dubious runtime behavior.");
// const SyntaxWarning = simpleExtends(Warning, "SyntaxWarning", "Base class for warnings about dubious syntax.");
// const UserWarning = simpleExtends(Warning, "UserWarning", "Base class for warnings generated by user code.");
// const FutureWarning = simpleExtends(Warning, "FutureWarning", "Base class for warnings about constructs that will change semantically\nin the future.");
// const ImportWarning = simpleExtends(Warning, "ImportWarning", "Base class for warnings about probable mistakes in module imports");
// const UnicodeWarning = simpleExtends(Warning, "UnicodeWarning", "Base class for warnings about Unicode related problems, mostly\nrelated to conversion problems.");
// const BytesWarning = simpleExtends(Warning, "BytesWarning", "Base class for warnings about bytes and buffer related problems, mostly\nrelated to conversion from str or comparing to str.");
// const ResourceWarning = simpleExtends(Warning, "ResourceWarning", "Base class for warnings about resource usage.");

const pyExc = {
    BaseException,
    SystemExit,
    KeyboardInterrupt,
    GeneratorExit,
    Exception,
    StopIteration,
    StopAsyncIteration,
    ArithmeticError,
    FloatingPointError,
    OverflowError,
    ZeroDivisionError,
    AssertionError,
    AttributeError,
    BufferError,
    EOFError,
    ImportError,
    ModuleNotFoundError,
    LookupError,
    IndexError,
    KeyError,
    MemoryError,
    NameError,
    UnboundLocalError,
    OSError,
    IOError: OSError,
    // BlockingIOError,
    // ChildProcessError,
    // ConnectionError,
    // BrokenPipeError,
    // ConnectionAbortedError,
    // ConnectionRefusedError,
    // ConnectionResetError,
    // FileExistsError,
    FileNotFoundError,
    // InterruptedError,
    // IsADirectoryError,
    // NotADirectoryError,
    // PermissionError,
    // ProcessLookupError,
    TimeoutError,
    ReferenceError,
    RuntimeError,
    NotImplementedError,
    RecursionError,
    SyntaxError,
    IndentationError,
    TabError,
    SystemError,
    TypeError,
    ValueError,
    UnicodeError,
    UnicodeDecodeError,
    UnicodeEncodeError,
    // UnicodeTranslateError,
    // Warning,
    // DeprecationWarning,
    // PendingDeprecationWarning,
    // RuntimeWarning,
    // SyntaxWarning,
    // UserWarning,
    // FutureWarning,
    // ImportWarning,
    // UnicodeWarning,
    // BytesWarning,
    // ResourceWarning,
};

Object.assign(Sk.builtin, pyExc);


Sk.builtin.SuspensionError = simpleExtends(Exception, "SuspensionError", "Unsupported Suspension in code.");

Sk.builtin.ExternalError = Sk.abstr.buildNativeClass("ExternalError", {
    constructor: function ExternalError(...args) {
        this.nativeError = args[0];
        if (!Sk.builtin.checkString(this.nativeError)) {
            args[0] = this.nativeError.toString();
            if (args[0].startsWith("RangeError: Maximum call")) {
                args[0] = "Maximum call stack size exceeded";
                return new RecursionError(...args);
            }
        }
        Exception.apply(this, args);
    },
    base: Exception,
});


/**
 * @constructor
 */
Sk.builtin.frame = function (trace) {
    if (!(this instanceof Sk.builtin.frame)) {
        return new Sk.builtin.frame(trace);
    }
    this.trace = trace;
    this.__class__ = Sk.builtin.frame;
    return this;
};

Sk.abstr.setUpInheritance("frame", Sk.builtin.frame, Sk.builtin.object);

Sk.builtin.frame.prototype.tp$getattr = function (name) {
    if (name != null && (Sk.builtin.checkString(name) || typeof name === "string")) {
        var _name = name;

        // get javascript string
        if (Sk.builtin.checkString(name)) {
            _name = Sk.ffi.remapToJs(name);
        }

        let line = this.trace.source;
        if (line == null) {
            if (this.trace.filename != null && this.trace.lineno != null) {
                if (Sk.parse.linecache[this.trace.filename]) {
                    line = Sk.parse.linecache[this.trace.filename][this.trace.lineno-1];
                }
            }
        }

        switch (_name) {
            case "f_back":
                return Sk.builtin.none.none$;
            case "f_builtins":
                return Sk.builtin.none.none$;
            case "f_code":
                return Sk.builtin.none.none$;
            case "f_globals":
                return Sk.builtin.none.none$;
            case "f_lasti":
                return Sk.builtin.none.none$;
            case "f_lineno":
                return Sk.ffi.remapToPy(this.trace.lineno);
            case "f_line":
                return Sk.ffi.remapToPy(line);
            case "f_locals":
                return Sk.builtin.none.none$;
            case "f_trace":
                return Sk.builtin.none.none$;
            case "co_filename":
                return Sk.ffi.remapToPy(this.trace.filename);
            case "co_name":
                return Sk.ffi.remapToPy(this.trace.scope);
        }
    }

    // if we have not returned yet, try the genericgetattr
    return Sk.builtin.object.prototype.GenericGetAttr(name);
};
Sk.builtin.frame.prototype["$r"] = function () {
    return new Sk.builtin.str("<frame object>");
};
Sk.exportSymbol("Sk.builtin.frame", Sk.builtin.frame);

/**
 * @constructor
 * @param {Object} err
 */
Sk.builtin.traceback = function (trace) {
    if (!(this instanceof Sk.builtin.traceback)) {
        return new Sk.builtin.traceback(trace);
    }

    this.trace = trace;

    this.tb_lineno = new Sk.builtin.int_(trace.lineno);
    // TODO: Hack, you know this isn't right
    this.tb_frame = new Sk.builtin.frame(trace);
    this.tb_source = new Sk.builtin.str(trace.source);

    //tb_frame, tb_lasti, tb_lineno, tb_next

    this.__class__ = Sk.builtin.traceback;

    return this;
};

Sk.abstr.setUpInheritance("traceback", Sk.builtin.traceback, Sk.builtin.object);
Sk.builtin.traceback.fromList = function (traces) {
    var current = Sk.builtin.traceback(traces[0]),
        first = current;
    for (var i = 1; i < traces.length; i++) {
        current.tb_next = Sk.builtin.traceback(traces[i]);
        current = current.tb_next;
    }
    current.tb_next = Sk.builtin.none.none$;
    return first;
};
Sk.builtin.traceback.prototype.tp$getattr = function (name) {
    if (name != null && (Sk.builtin.checkString(name) || typeof name === "string")) {
        var _name = name;

        // get javascript string
        if (Sk.builtin.checkString(name)) {
            _name = Sk.ffi.remapToJs(name);
        }

        switch (_name) {
            case "tb_lineno":
            case "tb_source":
            case "tb_frame":
            case "tb_next":
                return this[_name];
        }
    }

    // if we have not returned yet, try the genericgetattr
    return Sk.builtin.object.prototype.GenericGetAttr(name);
};
Sk.builtin.traceback.prototype["$r"] = function () {
    return new Sk.builtin.str("<traceback object>");
};
Sk.exportSymbol("Sk.builtin.traceback", Sk.builtin.traceback);


// TODO: Extract into sys.exc_info(). Work out how the heck
// to find out what exceptions are being processed by parent stack frames...
Sk.builtin.getExcInfo = function (e) {
    const v = [e.ob$type || Sk.builtin.none.none$, e, Sk.builtin.none.none$];
    // TODO create a Traceback object for the third tuple element

    return new Sk.builtin.tuple(v);
};
