// npm run precompile OUTPUT-PATH INPUT-DIRECTORY MODULE-NAME
// Be sure to include the trailing slash for the input directory

const program = require("commander");

program
    .option("-m, --minify", "minify the resulting code")
    .parse(process.argv);

if (program.args.length !== 3) {
    console.log(chalk.red("error: must specify output directory, input directory, and module name"));
    process.exit(1);
}

const OUTPUT_FILE = program.args[0];
const SOURCE_DIR = program.args[1];
const MODULE_NAME = program.args[2];

const reqskulpt = require("../run/require-skulpt").requireSkulpt;
const skulpt = reqskulpt(false);
if (skulpt === null) {
    process.exit(1);
}
Sk.configure({__future__: Sk.python3});

const fs = require("fs");
const path = require("path");
const minify = require("babel-minify");
const beautify = require("js-beautify");

function buildPythonFile(ret, fullname, contents, shouldMinify) {
    var internalName = fullname;
    while (internalName.startsWith(SOURCE_DIR)) {
        internalName = internalName.slice(SOURCE_DIR.length);
    }
    internalName = "src/lib/"+internalName;
    try {
        // TODO: Support compile mode where we remove type annotations and docstrings
        co = Sk.compile(contents, internalName, "exec", true, true);
        console.log("Compiled: "+internalName);
    } catch (e) {
        console.log("Failed to compile: "+internalName);
        console.log(e);
        console.log(e.stack);
        console.error(e.args);
    }
    internalName = internalName.replace(/\.py$/, ".js");
    contents = co.code + "\nvar $builtinmodule = " + co.funcname + ";";
    if (shouldMinify) {
        contents = minify(contents).code;
    }
    ret[internalName] = contents;
}

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
                        if (ext === ".py") {
                            buildPythonFile(ret, fullname, contents, minifyjs);
                        }
                    }
                }
            }
        });
    });
}

var result = {};
processDirectories([SOURCE_DIR+MODULE_NAME], true, ".py", result, program.minify, []);
let output = [];
for (let filename in result) {
    let contents = result[filename];
    output.push("Sk.builtinFiles.files['"+filename+"'] = "+JSON.stringify(contents));
}
fs.writeFileSync(OUTPUT_FILE, output.join("\n"), "utf8", {flag: "w"});

console.log(Object.keys(result));
