var $builtinmodule = function (name) {
    const STRING_PIL = new Sk.builtin.str("PIL");
    return {
        __name__: STRING_PIL
    };
};
