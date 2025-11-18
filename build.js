#!/usr/bin/env node
/* build.js */
const projectRoot = __dirname;
const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");
const chalk = require("chalk");
const zlib = require("zlib");
const esbuild = require("esbuild");

// --- config-ish bits you had in webpack -----------------------------
const entry = "src/main.js";
const outdir = "dist";
const outfileDev = "skulpt.js";
const outfileProd = "skulpt.min.js";
const debuggerSrc = "debugger/debugger.js";
const debuggerDst = "debugger.js";
const externsNote =
    "// NOTE: esbuild has no direct 'externs' like Closure; use 'external' instead.\n";

// env parsing (support --mode=production like webpack)
const args = process.argv.slice(2);
const argMode = (args.find((a) => a.startsWith("--mode=")) || "").split("=")[1];
const mode = argMode || process.env.NODE_ENV || "development";
const production = mode === "production";
const target = process.env.ES_TARGET || process.env.languageOut || "es2015"; // mimic languageOut a bit

// --- git checks ------------------------------------------------------
function haveGit() {
    try {
        execSync("git --version", { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}
if (!haveGit()) {
    console.log(chalk.red("WARNING: Cannot find git! Unsure if working directory is clean."));
}

try {
    // Will exit non-zero if dirty
    execSync("git diff-index --quiet HEAD --", { stdio: "ignore" });
    console.log("Working directory is clean.");
} catch {
    console.log(chalk.red("WARNING: Working directory is not clean."));
}

function git(cmd, fallback = "") {
    try {
        return execSync(cmd, { encoding: "utf8" }).trim();
    } catch {
        return fallback;
    }
}
const GITVERSION = git("git describe --tags --always", "unknown");
const GITHASH = git("git rev-parse --short HEAD", "unknown");
const GITBRANCH = git("git rev-parse --abbrev-ref HEAD", "unknown");
const BUILDDATE = new Date().toISOString();

// --- tiny helpers ----------------------------------------------------
function cleanDir(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dstDir, toName) {
    fs.mkdirSync(dstDir, { recursive: true });
    const to = path.join(dstDir, toName);
    fs.copyFileSync(src, to);
    return to;
}

function gzipFile(srcPath) {
    const gzPath = srcPath + ".gz";
    const input = fs.readFileSync(srcPath);
    const output = zlib.gzipSync(input);
    fs.writeFileSync(gzPath, output);
    return gzPath;
}

// --- esbuild plugins to mirror webpack bits --------------------------
/** Simple “copy” plugin for the debugger file (runs once after build). */
const copyDebuggerPlugin = {
    name: "copy-debugger",
    setup(build) {
        build.onEnd(() => {
            copyFile(debuggerSrc, outdir, debuggerDst);
            console.log(chalk.gray(`Copied ${debuggerSrc} → ${path.join(outdir, debuggerDst)}`));
        });
    },
};

/** Gzip only the production bundle named skulpt.min.js (like CompressionWebpackPlugin include). */
const gzipPlugin = {
    name: "gzip-min",
    setup(build) {
        build.onEnd((result) => {
            if (result.errors.length) {
                return;
            }
            const outFile = path.join(outdir, production ? outfileProd : outfileDev);
            if (production && fs.existsSync(outFile)) {
                const gz = gzipFile(outFile);
                console.log(chalk.gray(`Gzipped ${path.basename(outFile)} → ${path.basename(gz)}`));
            }
        });
    },
};

/** ESLint “pre” step replacement (optional). Runs eslint if available. */
const eslintPlugin = {
    name: "eslint-run",
    setup(build) {
        if (!production) {
            return;
        } // mimic your webpack rule (prod only)
        build.onStart(() => {
            try {
                // respect the same exclude pattern from your webpack (approx)
                // You can tune the globs in your .eslintignore instead.
                console.log(chalk.gray("Running ESLint…"));
                execSync(`npx eslint "**/*.js" --max-warnings=0`, { stdio: "inherit" });
            } catch (e) {
                // Fail the build if ESLint fails (similar to noEmitOnErrors true)
                process.exit(1);
            }
        });
    },
};

// --- clean, then build -----------------------------------------------
cleanDir(outdir);

const outfile = production ? outfileProd : outfileDev;

// Aliasing 'assert' to assert-dev/prod.js like your resolve.alias
const assertAliasPath = path.resolve(
    projectRoot,
    production ? "src/assert-prod.js" : "src/assert-dev.js"
);

if (!fs.existsSync(assertAliasPath)) {
    console.error(chalk.red(`Missing file: ${assertAliasPath}`));
    process.exit(1);
}

// Style/exclude filters you had in webpack (not needed in esbuild for bundling).
// If you need to exclude specific files from parsing, use 'external' or 'inject'.

esbuild
    .build({
        entryPoints: [entry],
        outfile: path.join(outdir, outfile),
        bundle: true,
        sourcemap: true,
        minify: production, // replaces Closure + minimizer
        target: target, // rough stand-in for languageOut
        define: {
            GITVERSION: JSON.stringify(GITVERSION),
            GITHASH: JSON.stringify(GITHASH),
            GITBRANCH: JSON.stringify(GITBRANCH),
            BUILDDATE: JSON.stringify(BUILDDATE),
        },
        // Equivalent to webpack resolve.alias
        alias: {
            assert: assertAliasPath,
        },
        // If you previously relied on globals, uncomment:
        // external: ["jsbi"], // <-- mirrors your commented webpack externals
        plugins: [eslintPlugin, copyDebuggerPlugin, gzipPlugin],
        // Nice-to-haves
        logLevel: "info",
    })
    .then(() => {
        // Optional: write a small note about externs
        const notePath = path.join(outdir, "ESBUILD_NOTES.txt");
        fs.writeFileSync(notePath, externsNote);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
