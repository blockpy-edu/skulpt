# Skulpt JavaScript Python Interpreter

Skulpt is a JavaScript implementation of Python that runs in your browser. This is a BlockPy fork adding AST parser enhancements, MatPlotLib module, and exec support.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `npm install --legacy-peer-deps` -- installs dependencies. REQUIRED: Use `--legacy-peer-deps` flag due to closure compiler dependency conflicts.
  - `npm run devbuild` -- development build (unoptimized). Takes ~25 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
  - `npm run build` -- production build (optimized). **CURRENT ISSUE**: Fails due to extensive ESLint indentation errors in the codebase.
  - `npm test` -- runs all tests. Takes ~5 seconds. NEVER CANCEL. Set timeout to 30+ minutes.
  - `npm run dist` -- full distribution (build + test + docs). **WARNING**: Currently fails due to production build issues.

- Run Python code:
  - `npm start py3 <file.py>` -- run Python 3 file (requires devbuild first)
  - `npm start py2 <file.py>` -- run Python 2 file (requires devbuild first)
  - `npm run repl py3` -- open Python 3 REPL (requires devbuild first)
  - `npm run repl py2` -- open Python 2 REPL (requires devbuild first)

- Browser testing:
  - `npm run brun <file.py>` -- runs Python file in browser (opens local server at localhost:8080)
  - `npm run btest` -- runs unit tests in browser

## Build Issues and Workarounds

- **Critical Issue**: Production builds (`npm run build`, `npm run dist`) fail due to extensive ESLint indentation errors throughout the codebase.
- **Workaround**: Use development builds (`npm run devbuild`) which skip linting and work correctly.
- **Dependency Issue**: Must use `npm install --legacy-peer-deps` due to google-closure-compiler version conflicts.
- **Working Directory Warning**: Build system warns about unclean working directory but continues normally.

## Validation

- Always use `npm run devbuild` first before testing any changes.
- Test basic functionality with the REPL: `npm run repl py3`, then try:
  ```python
  print("Hello, Skulpt!")
  import math
  math.sqrt(16)
  ```
- Test file execution by creating a test script and running: `npm start py3 <file.py>`
- ALWAYS manually test Python functionality after making changes to ensure the interpreter works correctly.
- Test results show ~553/563 tests pass (98.2% pass rate).

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Development Workflow Commands

```bash
# Essential workflow (use these commands in order):
npm install --legacy-peer-deps    # ~55 seconds
npm run devbuild                  # ~25 seconds  
npm test                          # ~5 seconds
npm start py3 <file.py>          # Run Python file
npm run repl py3                 # Interactive Python shell
```

### Available NPM Commands

```bash
npm run help                     # Show all available commands
npm run devbuild                # Development build (WORKS)
npm run build                   # Production build (FAILS - linting errors)
npm run watch                   # Development build with file watching
npm run dist                    # Full distribution (FAILS - depends on build)
npm run brun <file.py>          # Run Python file in browser
npm run btest                   # Run unit tests in browser
npm run repl <py2|py3>          # Open Python REPL
npm test                        # Run all tests
npm start <py2|py3> <file.py>   # Run Python file
npm run doc                     # Build documentation (~2 seconds)
npm run profile <py2|py3> <file.py>  # Profile Python execution
```

### Repository Structure

```
skulpt/
├── src/                        # Main source code (JavaScript)
├── test/                       # Test files and framework
│   ├── run/                   # Runtime tests
│   ├── unit/                  # Python 2 unit tests
│   └── unit3/                 # Python 3 unit tests
├── support/                    # Build tools and utilities
├── dist/                       # Built artifacts (created by build)
├── doc/                        # Documentation
├── package.json               # NPM configuration
├── webpack.config.js          # Build configuration
├── .eslintrc.json            # Linting rules (causing build issues)
├── README.md                  # Basic project info
├── HACKING.md                 # Detailed development guide
└── CONTRIBUTING.md            # Contribution guidelines
```

### Key Files in src/

```
src/main.js                    # Entry point
src/compile.js                 # Python to JavaScript compiler
src/ast.js                     # Abstract syntax tree
src/builtin/                   # Built-in Python functions
src/lib/                       # Python standard library modules
```

### Test Execution Output Example

```
run: 553/563 (+1 disabled)
Total run time for all tests: 2.978s
```

## Known Issues

1. **Production Build Failure**: `npm run build` fails with 400+ ESLint indentation errors across multiple files including dict.js, enumerate.js, file.js, function.js, list.js, etc.

2. **Dependency Conflicts**: Must use `--legacy-peer-deps` with npm install due to google-closure-compiler version incompatibility.

3. **Test Failures**: Some tests fail (10/563), mostly related to minor syntax error reporting differences.

4. **Linting Standards**: Codebase has inconsistent indentation (mix of tabs and spaces) that violates ESLint rules.

## Module Development

- Python modules are in `src/lib/` (Python files) and `src/builtin/` (JavaScript implementations)
- After modifying modules, always run `npm run devbuild` to rebuild skulpt-stdlib.js
- Test module changes with both `npm test` and manual REPL testing

## Debugging

- Use `npm run repl py3` for interactive testing
- Add print statements in Python code for debugging
- JavaScript source maps are available in development builds
- Use browser developer tools when testing with `npm run brun`

## Performance Notes

- Development builds are fast (~25 seconds) and sufficient for most development
- Production builds with optimization take longer but currently fail due to linting
- Test suite execution is very fast (~5 seconds)
- REPL startup is nearly instantaneous

## Python Feature Support

- Supports most Python 3.7-ish features
- Includes math, random, turtle, time, urllib, unittest, and other standard library modules
- MatPlotLib support (BlockPy addition)
- AST parser with end-of-line/column information (BlockPy addition)
- Exec support (BlockPy addition)
- Both Python 2 and Python 3 modes available

Fixes #1.