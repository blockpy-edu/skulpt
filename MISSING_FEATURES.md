# Skulpt Missing Python Features

This document provides a comprehensive analysis of missing Python features in the Skulpt JavaScript implementation. The analysis is based on code examination, test results, and documentation as of the current repository state.

## Executive Summary

**Current Status:**
- **Test Pass Rate**: 553/563 tests (98.2%) - indicating strong core functionality
- **Standard Library Coverage**: ~150+ modules exist as NotImplementedError stubs
- **Python Version Support**: Mixed Python 2/3 with configurable mode via `Sk.python3` flag
- **Core Language**: Most basic features implemented, advanced features missing

---

## 1. CORE LANGUAGE SYNTAX FEATURES

### 1.1 Python 2.7 Features (Missing)

#### Set Literals
```python
# NOT SUPPORTED
{1, 2, 3}  # Set literal syntax
```

#### Dictionary Comprehensions  
```python
# NOT SUPPORTED
{k: v for k, v in items}  # Dict comprehension
```

#### Multiple Context Managers
```python
# NOT SUPPORTED  
with open(f1) as a, open(f2) as b:
    pass
```

### 1.2 Python 3 Features (Missing/Limited)

#### Type Annotations
```python
# FAILS - Test t905.py shows SyntaxError
a: int = 0  # Annotated assignment
def func(x: int) -> str:  # Function annotations
    pass
```

#### f-strings (f"" literals)
```python
# NOT SUPPORTED
name = "world" 
f"Hello {name}"  # Formatted string literals
```

#### Advanced Unpacking
```python
# NOT SUPPORTED in Python 2 mode
a, *b, c = sequence  # Extended unpacking
*args, = sequence    # Starred expressions
```

#### Async/Await
```python
# NOT SUPPORTED
async def func():
    await something
```

#### Keyword-Only Arguments
```python
# NOT SUPPORTED
def func(a, *, b):  # Keyword-only args after *
    pass
```

#### Exception Chaining
```python
# NOT SUPPORTED
raise ValueError("error") from e
```

#### Nonlocal Keyword
```python
# NOT SUPPORTED
nonlocal var
```

---

## 2. BUILT-IN FUNCTIONS AND TYPES

### 2.1 Completely Missing Built-ins

From `src/builtin.js` analysis:

```python
bytearray()     # NotImplementedError stub
memoryview()    # NotImplementedError stub
locals()        # NotImplementedError stub  
vars()          # NotImplementedError stub
reload()        # NotImplementedError stub
help()          # NotImplementedError stub
execfile()      # NotImplementedError stub
apply()         # NotImplementedError stub
buffer()        # NotImplementedError stub
coerce()        # NotImplementedError stub
intern()        # NotImplementedError stub
```

### 2.2 Partially Implemented Built-ins

```python
eval()          # Cannot handle bytes input
compile()       # Limited functionality - "cannot construct a code object"
dir()           # Fails with no arguments
complex()       # Missing __format__ method
```

### 2.3 Missing Built-in Methods

From `src/numtype.js` - numeric type methods not implemented:
```python
# These throw NotImplementedError for custom numeric types:
__abs__, __neg__, __pos__
__int__, __long__, __float__  
__add__, __radd__, __sub__, __rsub__
__mul__, __rmul__, __div__, __rdiv__
__floordiv__, __rfloordiv__
__mod__, __rmod__, __divmod__, __rdivmod__
__pow__, __rpow__, __coerce__
```

---

## 3. STANDARD LIBRARY MODULES

### 3.1 Completely Missing (150+ modules)

The following modules exist only as NotImplementedError stubs in `src/lib/`:

#### Core Language Support
```
contextlib    - Context manager utilities
functools     - Functional programming tools (has .js version)  
itertools     - Iterator tools (has .js version)
collections   - Specialized containers (has .js version)
operator      - Operator functions (has .js version)
copy          - Shallow/deep copy operations
weakref       - Weak references
gc            - Garbage collection interface
```

#### Date/Time and Math
```
calendar      - Calendar functions
datetime      - Date/time types (has .js version)
decimal       - Arbitrary precision decimal
fractions     - Rational numbers  
```

#### System and OS
```
os            - Operating system interface
sys           - System parameters (has .js version)
platform      - Platform identification (has .js version)
subprocess    - Process management
signal        - Signal handling
threading     - Thread management
multiprocessing - Process-based parallelism
```

#### File and Path Handling  
```
pathlib       - Object-oriented paths
tempfile      - Temporary files
shutil        - High-level file operations
glob          - Filename pattern matching
fnmatch       - Filename matching patterns
```

#### Network and Internet
```
socket        - Network interface
urllib        - URL handling (partial exists)
urllib2       - Extended URL library
httplib       - HTTP client library
email         - Email handling
html          - HTML processing (has .js version)
```

#### Data Formats
```
json          - JSON handling (directory exists)
csv           - CSV files (has implementation)
xml           - XML processing (all submodules are stubs)
sqlite3       - SQLite database (directory exists)
pickle        - Python object serialization
struct        - Binary data handling
```

#### Development and Debugging
```
unittest      - Unit testing (has implementation)
doctest       - Documentation testing
pdb           - Python debugger
profile       - Performance profiling
cProfile      - C profiler interface
trace         - Execution tracing
dis           - Bytecode disassembly
```

### 3.2 Partially Implemented Modules

Based on README.md and .js versions found:

```
time          - Basic time functions (time.js exists)
random        - Random number generation (random.js exists)
re            - Regular expressions (re.js exists) 
math          - Mathematical functions (math.js exists)
string        - String operations (string.js exists)
urllib        - URL handling (partial implementation noted)
```

---

## 4. ADVANCED PYTHON FEATURES

### 4.1 Object Model Limitations

#### Metaclasses
- `super()` has limitations - "unbound super not supported" in `typeobject.js`
- `__prepare__` method for metaclasses not supported
- Limited `__new__` method support

#### Descriptors  
```python
# Limited descriptor protocol support
class descriptor:
    def __get__(self, obj, type): pass
    def __set__(self, obj, val): pass  
    def __delete__(self, obj): pass
```

#### Slots
```python
# NOT SUPPORTED
class MyClass:
    __slots__ = ['x', 'y']  # Memory optimization
```

#### Special Methods
```python
__del__       # Destructor not supported
__missing__   # For dict subclasses  
__reduce__    # Serialization support (limited in structseq.js)
```

### 4.2 Iterator and Generator Protocol

From `simple_iterators.js`:
- Some iterator features throw NotImplementedError
- Generator support unclear from analysis

### 4.3 Context Manager Protocol

```python
# Limited support for:
with expression as var:
    pass

# Multiple context managers not supported:
with expr1 as var1, expr2 as var2:
    pass
```

---

## 5. PYTHON 2 vs 3 COMPATIBILITY ISSUES

### 5.1 Syntax Differences
- Print function vs statement
- Extended unpacking syntax differences
- Exception syntax changes
- Import system changes

### 5.2 Semantic Differences  
- Integer division behavior (`/` vs `//`)
- String vs bytes distinction  
- Iterator vs list returns (range, map, filter, zip)
- Unicode handling differences

### 5.3 Configuration
- Uses `Sk.python3` flag for version switching
- Many features need dual implementation paths
- From README: "Python3 semantics should be configurable with single flag"

---

## 6. THIRD-PARTY AND ADVANCED LIBRARIES

### 6.1 Scientific Computing (Partially Implemented)
```
numpy         - Numerical arrays (directory exists)
matplotlib    - Plotting (basic implementation exists) 
```

### 6.2 Missing Advanced Libraries  
```
tkinter       - GUI toolkit (mentioned in README)
ctypes        - Foreign function interface
```

---

## 7. IMPLEMENTATION PRIORITY ASSESSMENT

### 7.1 High Priority (Core Language)
1. **Python 3 syntax features** - f-strings, type annotations, async/await
2. **Missing built-in functions** - locals(), vars(), bytearray, memoryview  
3. **Complete numeric type support** - all magic methods in numtype.js
4. **Set literals and dict comprehensions** - Python 2.7 features

### 7.2 Medium Priority (Standard Library Core)
1. **Essential modules** - os, sys, pathlib, contextlib, functools
2. **Data handling** - json, xml, csv completion  
3. **Development tools** - unittest completion, doctest, pdb
4. **File/IO operations** - tempfile, shutil, glob

### 7.3 Lower Priority (Advanced Features)
1. **Network modules** - socket, urllib completion, httplib
2. **Threading/multiprocessing** - Complex browser environment issues
3. **System interfaces** - Limited browser capability  
4. **Advanced object model** - metaclasses, descriptors, slots

### 7.4 Specialized (Domain-Specific)
1. **Scientific libraries** - numpy/matplotlib completion
2. **Database interfaces** - sqlite3
3. **GUI frameworks** - tkinter
4. **Foreign interfaces** - ctypes

---

## 8. TESTING AND VALIDATION NOTES

- Current test suite: 553/563 tests passing (98.2%)
- Test failures mainly syntax edge cases (e.g., t905.py annotation syntax)
- High pass rate indicates core functionality is solid
- Missing features are primarily extensions to working base

---

## 9. RECOMMENDATIONS FOR CONTRIBUTORS

### For Beginners:
- Implement NotImplementedError stub modules in `src/lib/`
- Add missing built-in functions in `builtin.js`
- Complete partial implementations (time, random, urllib, re)

### For Intermediate:
- Python 2.7 syntax features (set literals, dict comprehensions)
- Core standard library modules (os, pathlib, contextlib)
- Complete numeric type methods in `numtype.js`

### For Advanced:
- Python 3 syntax features (f-strings, async/await, annotations)  
- Advanced object model features (metaclasses, descriptors)
- Complex standard library modules (threading, multiprocessing)

### For Experts:
- Complete Python 3 compatibility
- Performance optimization  
- Browser-specific integrations
- Scientific library implementations

---

*This analysis was generated by examining the blockpy-edu/skulpt repository code, test results, and documentation. For the most current status, always check the latest repository state.*