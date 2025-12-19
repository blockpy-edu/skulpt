function noneToNoneType(obj) {
    if (obj === Sk.builtin.none.none$) {
        return Sk.builtin.none;
    }
    return obj;
}

function isUnionable(obj) {
    // TODO: Handle GenericAlias and TypeAliasType when implemented
    return (obj === Sk.builtin.none.none$) ||
        (obj instanceof Sk.builtin.type) ||
        (obj instanceof Sk.builtin.uniontype) ||
        (obj instanceof Sk.builtin.GenericAlias);
}

function typeRepr(o) {
    // Closest analogue to _Py_typing_type_repr for Skulpt.
    // For types, use tp$name; else fallback to Sk.repr.
    if (o instanceof Sk.builtin.type) {
        // For builtins, tp$name is usually "int", "str", etc.
        return new Sk.builtin.str(o.tp$name);
    }
    return Sk.builtin.repr(o);
}

function containsSequence(seq, item) {
    // seq is a tuple
    const n = seq.v.length;
    for (let i = 0; i < n; i++) {
        const eq = Sk.misceval.richCompareBool(seq.v[i], item, "Eq");
        if (eq) {
            return true;
        }
    }
    return false;
}

function tryHash(obj) {
    // Returns {ok: true, hash} or {ok: false, err}
    try {
        const h = Sk.builtin.hash(obj);
        return { ok: true, hash: h };
    } catch (e) {
        return { ok: false, err: e };
    }
}

class UnionBuilder {
    constructor({ checked } ) {
        this.argsList = [];
        this.hashableSet = new Sk.builtin.set([]);
        this.unhashableList = null;
        this.checked = checked;
    }
    addTuple(tup) {
        const arr = tup.v;
        for (let i = 0; i < arr.length; i++) {
            this.addSingle(arr[i]);
        }
    }

    typeCheck(arg) {
        // CPython delegates to typing._type_check; here we implement the same
        // surface behavior needed for unions: each arg must be a "type-like".
        //
        // If you have Skulpt's typing module with _type_check, you can call it here.
        // For now: accept unionable objects only.
        if (!isUnionable(arg)) {
            throw new Sk.builtin.TypeError(
                "Union[arg, ...]: each arg must be a type."
            );
        }
        return arg;
    }

    addSingle(arg) {
        arg = noneToNoneType(arg);

        // Flatten nested unions.
        if (arg instanceof Sk.builtin.uniontype) {
            this.addTuple(arg.$args);
            return;
        }

        if (this.checked) {
            arg = this.typeCheck(arg);
        }

        this.addSingleUnchecked(arg);
    }

    addSingleUnchecked(arg) {
        // Partition by hashability, dedupe within each partition.
        const h = tryHash(arg);

        if (!h.ok) {
            // Unhashable bucket.
            if (this.unhashableList === null) {
                this.unhashableList = [];
            } else {
                // Deduplicate by containment.
                for (let i = 0; i < this.unhashableList.length; i++) {
                    if (Sk.misceval.richCompareBool(this.unhashableList[i], arg, "Eq")) {
                        return; // already present
                    }
                }
            }
            this.unhashableList.push(arg);
        } else {
            // Hashable bucket using set containment.
            if (this.hashableSet.sq$contains(arg)) {
                return; // already present
            }
            this.hashableSet.set$add(arg);
        }

        // Always preserve first-seen order in argsList.
        this.argsList.push(arg);
    }

    makeUnion() {
        if (this.argsList.length === 0) {
            throw new Sk.builtin.TypeError("Cannot take a Union of no types.");
        }
        if (this.argsList.length === 1) {
            return this.argsList[0];
        }

        const argsTuple = new Sk.builtin.tuple(this.argsList.slice());
        const hashableFrozen = new Sk.builtin.frozenset(this.hashableSet);

        let unhashableTuple = null;
        if (this.unhashableList !== null) {
            unhashableTuple = new Sk.builtin.tuple(this.unhashableList.slice());
        }

        return new Sk.builtin.uniontype(argsTuple, hashableFrozen, unhashableTuple);
    }

}


/**
 * @constructor
 *
 */
Sk.builtin.uniontype = Sk.abstr.buildNativeClass("types.UnionType", {
    constructor: function UnionType(argsTuple, hashableFrozen, unhashableTupleOrNull) {
        this.$args = argsTuple;
        this.$hashable_args = hashableFrozen;
        this.$unhashable_args = unhashableTupleOrNull;
        this.$parameters = null;
    },
    slots: {
        tp$getattr: Sk.generic.getAttr,
        tp$doc: "Represent a union type\n\nE.g., for int | str",
        tp$as_number: true,
        $r() {
            const typeNames = this.$args.v.map(typeRepr);
            return new Sk.builtin.str(typeNames.join(" | "));
        },
        tp$hash() {
            // If any unhashable args exist, the union is unhashable.
            if (this.$unhashable_args !== null) {
                const arr = this.$unhashable_args.v;
                // Attempt to hash one of them to surface its error,
                // mirroring CPython's behavior.
                try {
                    for (let i = 0; i < arr.length; i++) {
                        Sk.abstr.objectHash(arr[i]); // will throw
                    }
                } catch (e) {
                    throw new Sk.builtin.TypeError(
                        "union contains " + arr.length + " unhashable elements"
                    );
                }
            }
            return Sk.abstr.objectHash(this.$hashable_args);
        },
        tp$richcompare(other, op) {
            if ((op !== "Eq" && op !== "NotEq") || !(other instanceof Sk.builtin.uniontype)) {
                return Sk.builtin.NotImplemented.NotImplemented$;
            }
            const equal = unionsEqual(this, other);
            return new Sk.builtin.bool((op === "Eq") ? equal : !equal);
        },
        // Enable `union | X` and `X | union`
        nb$or: function (other) {
            const ub = new UnionBuilder({ checked: true });
            ub.addSingle(this);
            ub.addSingle(other);
            return ub.makeUnion();
        },
        // Optional: `union[item]` (subscript) used for parameter substitution.
        mp$subscript: function (item) {
            // For now, return self unmodified.
            // In CPython, this is used for substituting TypeVars in unions.
            return this;
        }
    },
    getsets: {
        __args__: {
            $get: function () {
                return this.$args;
            },
            $doc: "The arguments to the Union",
        },
        __origin__: {
            $get: function () {
                return Sk.builtin.uniontype;
            },
            $doc: "The origin of the Union",
        },
        __name__: {
            $get: function () {
                return new Sk.builtin.str("Union");
            },
            $doc: "The name of the Union",
        },
        __qualname__: {
            $get: function () {
                return new Sk.builtin.str("Union");
            },
            $doc: "The qualified name of the Union",
        },
        __parameters__: {
            $get: function () {
                if (this.$parameters === null) {
                    this.$parameters = new Sk.builtin.tuple([]);
                }
                return this.$parameters;
            },
            $doc: "The type variables in the Union, if any",
        },
    },
    methods: {
        __mro_entries__: {
            $meth: function() {
                throw new Sk.builtin.TypeError("Cannot subclass " + Sk.builtin.repr(this).v);
            },
            $flags: { OneArg: true},
        }
    },
});

function unionsEqual(a, b) {
    // First compare hashable frozensets.
    const hsEq = Sk.misceval.richCompareBool(a.$hashable_args, b.$hashable_args, "Eq");
    if (!hsEq) {
        return false;
    }

    const ua = a.$unhashable_args;
    const ub = b.$unhashable_args;

    if (ua !== null && ub !== null) {
        const na = ua.v.length;
        const nb = ub.v.length;
        if (na !== nb) {
            return false;
        }

        // Check mutual containment.
        for (let i = 0; i < na; i++) {
            if (!containsSequence(ub, ua.v[i])) {
                return false;
            }
        }
        for (let i = 0; i < nb; i++) {
            if (!containsSequence(ua, ub.v[i])) {
                return false;
            }
        }
        return true;
    }

    if (ua !== null || ub !== null) {
        return false;
    }
    return true;
}

// ---- public constructors (CPython analogues) --------------------------

Sk.builtin.unionFromTuple = function unionFromTuple(args) {
    const ub = new UnionBuilder({ checked: true });

    if (args instanceof Sk.builtin.tuple) {
        ub.addTuple(args);
    } else {
        ub.addSingle(args);
    }
    return ub.makeUnion();
};

// Fast-path equivalent of _Py_union_type_or (unchecked, only unionable).
Sk.builtin.unionTypeOr = function unionTypeOr(a, b) {
    if (!isUnionable(a) || !isUnionable(b)) {
        return Sk.builtin.NotImplemented.NotImplemented$;
    }
    const ub = new UnionBuilder({ checked: false });
    ub.addSingle(a);
    ub.addSingle(b);
    return ub.makeUnion();
};
