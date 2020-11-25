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
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.BaseException = Sk.abstr.buildNativeClass("BaseException", {
    constructor: function Exception(...args) {
        // internally args is either a string
        Sk.asserts.assert(this instanceof Sk.builtin.BaseException);
        // hackage to allow shorter throws
        // let msg = args[0];
        // if (typeof msg === "string" ) {
        //     msg = new Sk.builtin.str(msg);
        // }
        this.args = new Sk.builtin.tuple([new Sk.builtin.str(args[0])]);
        this.traceback = [];
        // TODO: Hack, this exception isn't guaranteed to be thrown!
        this.err = Sk.err;
        this.__cause__ = Sk.builtin.none.none$;
        this.__context__ = Sk.builtin.none.none$;
        this.__suppress_context__ = Sk.builtin.none.none$;
        //Sk.err = this;

        // For errors occurring during normal execution, the line/col/etc
        // of the error are populated by each stack frame of the runtime code,
        // but we can seed it with the supplied parameters.
        if (args.length >= 3) {

            // if !this.args[1].v, this is an error, and the exception that causes it
            // probably needs to be fixed, but we mark as "<unknown>" for now
            this.traceback.push({
                lineno: args[2],
                filename: args[1] || "<unknown>"
            });
        }
    },
    slots: /**@lends {Sk.builtin.BaseException}*/{
        tp$getattr: Sk.generic.getAttr,
        tp$doc: "Common base class for all exceptions",
        tp$new: function (args, kwargs) {
            if (!this.hp$type) {
                // then we have a builtin constructor so just return it as new this
                return new this.constructor;
            } else {
                const instance = new this.constructor;
                Sk.builtin.BaseException.call(instance);
                return instance;
            }
        },
        tp$init: function (args, kwargs) {
            Sk.abstr.checkNoKwargs(Sk.abstr.typeName(this), kwargs);
            if (this.args.v !== args) {
                // we only initiate the args if they are not identical to the args from tp$new;
                this.args.v = args;
            }
            return Sk.builtin.none.none$;
        },
        $r: function () {
            let ret = this.tp$name;
            ret += "(" + this.args.v.map((x) => Sk.misceval.objectRepr(x)).join(", ") + ")";
            return new Sk.builtin.str(ret);
        },
        tp$str: function () {
            if (this.args.v.length <= 1) {
                return new Sk.builtin.str(this.args.v[0]);
            }
            return this.args.$r();
        }
    },
    getsets: /**@lends {Sk.builtin.BaseException}*/{
        args: {
            $get: function () { return this.args; },
            $set: function(v) { this.args = v; }
        },
        __cause__: {
            $get: function () { return this.__cause__; },
            $set: function(v) { this.__cause__ = v; }
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
    proto: /**@lends {Sk.builtin.BaseException}*/{
        toString: function () {
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

            /*for (i = 0; i < this.traceback.length; i++) {
                ret += "\n  at " + this.traceback[i].filename + " line " + this.traceback[i].lineno;
                if ("colno" in this.traceback[i]) {
                    ret += " column " + this.traceback[i].colno;
                }
            }*/

            return ret;
        }
    }
});

Sk.exportSymbol("Sk.builtin.BaseException", Sk.builtin.BaseException);

/**
 * @constructor
 * @extends Sk.builtin.BaseException
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.Exception = function (...args) {
    Sk.builtin.BaseException.apply(this, args);
};
Sk.abstr.setUpInheritance("Exception", Sk.builtin.Exception, Sk.builtin.BaseException);
Sk.exportSymbol("Sk.builtin.Exception", Sk.builtin.Exception);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.AssertionError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("AssertionError", Sk.builtin.AssertionError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.AssertionError", Sk.builtin.AssertionError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.AttributeError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("AttributeError", Sk.builtin.AttributeError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.ImportError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("ImportError", Sk.builtin.ImportError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.IndentationError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("IndentationError", Sk.builtin.IndentationError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.IndexError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("IndexError", Sk.builtin.IndexError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.KeyError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("KeyError", Sk.builtin.KeyError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.NameError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("NameError", Sk.builtin.NameError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.UnboundLocalError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("UnboundLocalError", Sk.builtin.UnboundLocalError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.OverflowError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("OverflowError", Sk.builtin.OverflowError, Sk.builtin.Exception);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*} args
 */
Sk.builtin.SyntaxError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
    this.msg = arguments.length >= 1 ? Sk.ffi.remapToPy(arguments[0]) : Sk.builtin.none.none$;
    this.filename = arguments.length >= 2 ? Sk.ffi.remapToPy(arguments[1]) : Sk.builtin.none.none$;
    this.lineno = arguments.length >= 3 ? Sk.ffi.remapToPy(arguments[2]) : Sk.builtin.none.none$;
    this.offset = arguments.length >= 4 ? Sk.ffi.remapToPy(arguments[3]) : Sk.builtin.none.none$;
    try {
        this.text = Sk.parse.linecache[arguments[1]][arguments[2]-1] || "";
    } catch (e) {
        this.text = "";
    }
    /*this.tp$setattr(new Sk.builtin.str("filename"), this.filename);
    this.tp$setattr(new Sk.builtin.str("lineno"), this.lineno);
    this.tp$setattr(new Sk.builtin.str("offset"), this.offset);*/
};
Sk.abstr.setUpInheritance("SyntaxError", Sk.builtin.SyntaxError, Sk.builtin.Exception);
Sk.abstr.setUpGetSets(Sk.builtin.SyntaxError, {
    filename: {
        $get: function () { return this.filename; },
        $set: function(v) { this.filename = v; }
    },
    lineno: {
        $get: function () { return this.lineno; },
        $set: function(v) { this.lineno = v; }
    },
    offset: {
        $get: function () { return this.offset; },
        $set: function(v) { this.offset = v; }
    },
    text: {
        $get: function () { return this.text; },
        $set: function(v) { this.text = v; }
    },
    msg: {
        $get: function () { return this.msg; },
        $set: function(v) { this.msg = v; }
    },
});

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.RuntimeError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("RuntimeError", Sk.builtin.RuntimeError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.RuntimeError", Sk.builtin.RuntimeError);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.OSError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("OSError", Sk.builtin.OSError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.OSError", Sk.builtin.OSError);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args
 */
Sk.builtin.SuspensionError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("SuspensionError", Sk.builtin.SuspensionError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.SuspensionError", Sk.builtin.SuspensionError);


/**
 * @constructor
 * @extends Sk.builtin.BaseException
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.SystemExit = function (...args) {
    Sk.builtin.BaseException.apply(this, args);
};
Sk.abstr.setUpInheritance("SystemExit", Sk.builtin.SystemExit, Sk.builtin.BaseException);
Sk.exportSymbol("Sk.builtin.SystemExit", Sk.builtin.SystemExit);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.TypeError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("TypeError", Sk.builtin.TypeError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.TypeError", Sk.builtin.TypeError);
/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.ValueError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("ValueError", Sk.builtin.ValueError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.ValueError", Sk.builtin.ValueError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.ZeroDivisionError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("ZeroDivisionError", Sk.builtin.ZeroDivisionError, Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.TimeoutError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("TimeoutError", Sk.builtin.TimeoutError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.TimeoutError", Sk.builtin.TimeoutError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.IOError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("IOError", Sk.builtin.IOError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.IOError", Sk.builtin.IOError);


/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.NotImplementedError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("NotImplementedError", Sk.builtin.NotImplementedError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.NotImplementedError", Sk.builtin.NotImplementedError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.NegativePowerError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("NegativePowerError", Sk.builtin.NegativePowerError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.NegativePowerError", Sk.builtin.NegativePowerError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args
 */
Sk.builtin.ExternalError = function (...args) {
    this.nativeError = args[0];
    if (!Sk.builtin.checkString(this.nativeError)) {
        args[0] = this.nativeError.toString();
    }
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("ExternalError", Sk.builtin.ExternalError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.ExternalError", Sk.builtin.ExternalError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.OperationError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("OperationError", Sk.builtin.OperationError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.OperationError", Sk.builtin.OperationError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.SystemError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("SystemError", Sk.builtin.SystemError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.SystemError", Sk.builtin.SystemError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.StopIteration = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("StopIteration", Sk.builtin.StopIteration, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.StopIteration", Sk.builtin.StopIteration);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.ReferenceError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("ReferenceError", Sk.builtin.ReferenceError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.ReferenceError", Sk.builtin.ReferenceError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.EOFError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("EOFError", Sk.builtin.EOFError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.EOFError", Sk.builtin.EOFError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {*=} args Typically called with a single string argument
 */
Sk.builtin.MemoryError = function (...args) {
    Sk.builtin.Exception.apply(this, args);
};
Sk.abstr.setUpInheritance("MemoryError", Sk.builtin.MemoryError, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.MemoryError", Sk.builtin.MemoryError);

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
    var v = [e.ob$type || Sk.builtin.none.none$, e, Sk.builtin.none.none$];

    // TODO create a Traceback object for the third tuple element

    return new Sk.builtin.tuple(v);
};
// NOT exported

