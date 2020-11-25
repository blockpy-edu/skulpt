const fs = require("fs");
const path = require("path");
const minify = require("babel-minify");
const beautify = require("js-beautify");


const reqskulpt = require("../run/require-skulpt").requireSkulpt;
var skulpt = reqskulpt();
if (skulpt === null) {
    process.exit(1);
}
Sk.configure({__future__: Sk.python3});

var ALLOW_LIST = ["src/lib/posixpath.py", "src/lib/traceback.py", "src/lib/io.py", "cisc108/", "unittest/"];
function endsWithAny(string, suffixes) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}
function inAllowList(filename, extension) {
    return ALLOW_LIST.some(function (entry) {
        if (entry.endsWith('/')) {
            return filename.startsWith('src/lib/'+entry);
        } else {
            return filename.endsWith(entry);
        }
    });
}

/**
 * If this optional file exists in the top level directory, it will be
 * used to exclude libraries from the standard library file.
 *
 * It should consist of a JSON array of filenames and/or directory
 * names (relative to the top level directory).
 *
 * Example:
 * [
 *   "src/lib/webgl",
 *   "src/lib/sqlite3",
 *   "src/lib/__phello__.foo.py"
 * ]
 *
 * This can be used to reduce the standard library file size by
 * excluding libraries that are not relevant to a particular
 * distribution.
 */
const excludeFileName = "libexcludes.json";

function processDirectories(dirs, recursive, exts, ret, minifyjs, excludes) {
    dirs.forEach((dir) => {
        let files = fs.readdirSync(dir);

        files.forEach((file) => {
            let fullname = dir + "/" + file;

            if (!excludes.includes(fullname)) {
                let stat = fs.statSync(fullname);

                if (recursive && stat.isDirectory()) {
                    processDirectories([fullname], recursive, exts, ret, minifyjs, excludes);
                } else if (stat.isFile()) {
                    let ext = path.extname(file);
                    if (exts.includes(ext)) {
                        let contents = fs.readFileSync(fullname, "utf8");
                        if (minifyjs && (ext === ".js")) {
                            let result = minify(contents);
                            contents = result.code;
                        // AOT compilation
                        } else if (ext === ".py" && //endsWithAny(fullname, ALLOW_LIST)
                                   inAllowList(fullname, ext)) {
                            var co;
                            try {
                                co = Sk.compile(contents, fullname, "exec", true, true);
                                console.log("Compiled: "+fullname);
                            } catch (e) {
                                console.log("Failed to compile: "+fullname);
                                console.log(e);
                                console.log(e.stack);
                                console.error(e.args);
                            }
                            fullname = fullname.replace(/\.py$/, ".js");
                            contents = co.code + "\nvar $builtinmodule = " + co.funcname + ";";
                            //fs.writeFileSync("dist/parts/"+file+".js", beautify(contents), 'utf8');
                            contents = minify(contents).code;
                            //fs.writeFileSync("dist/parts/"+file+".minified.js", contents, 'utf8');
                            //fs.writeFileSync("dist/parts/"+file+".minified.beautified.js", beautify(contents), 'utf8');
                        }
                        ret.files[fullname] = contents;
                    }
                }
            }
        });
    });
};


function buildJsonFile(name, dirs, exts, outfile, options) {
    options = options || {};
    let recursive = options.recursive || false;
    let minifyjs = options.minifyjs || false;
    let excludes = options.excludes || [];
    let dir, file;
    let ret = {};

    ret.files = {};

    processDirectories(dirs, recursive, exts, ret, minifyjs, excludes);

    let contents = "Sk." + name + "=" + JSON.stringify(ret);
    fs.writeFileSync(outfile, contents, "utf8");
    console.log("Updated " + outfile + ".");
}

if (process.argv.includes("internal")) {
    buildJsonFile("internalPy", ["src"], [".py"], "src/internalpython.js");
} else if (process.argv.includes("builtin")) {
    let excludes = [];
    if (fs.existsSync(excludeFileName)) {
        excludes = JSON.parse(fs.readFileSync(excludeFileName));
    }
    let opts = {
        recursive: true,
        minifyjs: true,
        excludes: excludes
    };

    if (!fs.existsSync("dist/parts/")){
        fs.mkdirSync("dist/parts/");
    }

    buildJsonFile("builtinFiles", ["src/builtin", "src/lib"], [".js", ".py"], "dist/skulpt-stdlib.js", opts);
} else if (process.argv.includes("unit2")) {
    if (!fs.existsSync("support/tmp")) {
        fs.mkdirSync("support/tmp");
    }
    buildJsonFile("unit2", ["test/unit"], [".py"], "support/tmp/unit2.js", { recursive: true });
} else if (process.argv.includes("unit3")) {
    if (!fs.existsSync("support/tmp")) {
        fs.mkdirSync("support/tmp");
    }
    buildJsonFile("unit3", ["test/unit3"], [".py"], "support/tmp/unit3.js");
}
