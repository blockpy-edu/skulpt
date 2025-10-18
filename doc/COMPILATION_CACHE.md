# Compilation Cache

## Overview

Skulpt now includes a compilation cache that dramatically improves performance when compiling the same Python code multiple times. This is particularly beneficial for:

- Repeated imports of the same module
- Running the same code multiple times (e.g., in a REPL or educational environment)
- Applications that use `exec()` or `compile()` with the same source code

## Performance

The compilation cache provides significant speedups:

- **Small files**: ~2700x speedup on cached compilations
- **Large files**: ~3600x speedup on cached compilations
- **exec() calls**: ~104x speedup on repeated code

## Configuration

The compilation cache can be configured via `Sk.configure()`:

```javascript
Sk.configure({
    compileCacheEnabled: true,      // Enable/disable cache (default: true)
    compileCacheMaxSize: 1000       // Maximum cache entries (default: 1000)
});
```

### Options

- **compileCacheEnabled** (boolean, default: `true`)
  - Enables or disables the compilation cache
  - Set to `false` to disable caching entirely

- **compileCacheMaxSize** (number, default: `1000`)
  - Maximum number of compiled code objects to cache
  - When the limit is reached, oldest entries are evicted (FIFO)
  - Increase for applications that compile many unique modules
  - Decrease to reduce memory usage

## Usage Examples

### Basic Usage (Cache Enabled by Default)

```javascript
Sk.configure({
    __future__: Sk.python3,
    read: builtinRead
});

// First compilation - cache miss
await Sk.importMainWithBody("test", false, "print('Hello')", true);

// Second compilation - cache hit (much faster)
await Sk.importMainWithBody("test", false, "print('Hello')", true);
```

### Disabling Cache

```javascript
Sk.configure({
    compileCacheEnabled: false  // Disable cache
});
```

### Custom Cache Size

```javascript
Sk.configure({
    compileCacheMaxSize: 5000  // Allow up to 5000 cached compilations
});
```

### Manual Cache Control

```javascript
// Clear the cache manually
Sk.compileCache.clear();

// Check cache size
console.log("Cache entries:", Sk.compileCache.size);

// Disable cache for one-off compilation
Sk.compileCacheEnabled = false;
Sk.compile(code, filename, "exec", true, true);
Sk.compileCacheEnabled = true;
```

## Implementation Details

### Cache Key

The cache uses a composite key based on:
- Source code hash (using a simple hash function)
- Filename
- Suspension mode (canSuspend parameter)
- Annotation mode (annotate parameter)

This ensures that the same source code compiled with different parameters gets separate cache entries.

### Cache Eviction

When the cache reaches `compileCacheMaxSize`, the oldest entry (first inserted) is removed using FIFO (First In, First Out) strategy.

### What Gets Cached

Only compilations in "exec" mode are cached. This includes:
- Module imports
- Code executed via `exec()` builtin
- Code compiled via `compile()` builtin

Compilations in "eval" and "single" mode are not cached as they're typically interactive one-offs.

### Cache Reset

The cache is automatically cleared when:
- `Sk.resetCompiler()` is called
- `Sk.importMain()` or `Sk.importMainWithBody()` is called (as part of compiler reset)

## Ahead-of-Time (AOT) Compilation

In addition to the runtime cache, Skulpt precompiles commonly used standard library modules at build time. The following modules are included:

- posixpath, dataclasses, traceback, io
- collections, copy, types, textwrap, itertools
- heapq, bisect, reprlib, genericpath, stat
- cisc108, unittest, bakery

These modules load instantly without any compilation overhead.

To add more modules to AOT compilation, edit `support/build/wrapmodules.js` and add entries to the `ALLOW_LIST` array.
