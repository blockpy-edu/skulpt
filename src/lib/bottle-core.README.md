# Bottle Core Library

A pure JavaScript implementation of a lightweight web framework similar to Python's Bottle framework, designed to work in browser environments.

## Overview

The Bottle Core library provides framework-agnostic functionality for:
- Route management (GET/POST)
- Navigation handling with event delegation
- URL and parameter parsing
- Form data processing
- File upload handling
- Request/response model
- Error handling

This library is decoupled from Skulpt and can be used with any Python-to-JS implementation (Skulpt, Brython, etc.) or directly in JavaScript projects.

## Architecture

### Core Components

1. **BottleCore** - Main class managing routes and requests
2. **RequestCore** - Represents an HTTP request
3. **FileUploadCore** - Handles file uploads
4. **Error Classes**:
   - `RouteNotFoundError` - Thrown when a route is not found
   - `ExternalRedirectError` - Thrown for external URL redirects
   - `BottleAbortError` - Thrown by the abort function

### Usage in Skulpt

The `bottle.js` module in `src/lib/` is a thin wrapper around this core library. It:
- Creates Python class wrappers for BottleCore, RequestCore, and FileUploadCore
- Handles conversion between Python and JavaScript objects
- Integrates with Skulpt's async/suspension mechanism
- Provides Python-friendly APIs

### Standalone Usage

The core library can be used independently of Skulpt:

```javascript
// Create a Bottle instance
const app = new BottleCore();

// Add routes
app.addRoute('/', 'GET', async () => {
    return '<h1>Hello World</h1>';
});

app.addRoute('/about', 'GET', async () => {
    return '<h1>About Page</h1>';
});

// Set up the root element
const rootElement = document.getElementById('app');
app.setRoot(rootElement);

// Setup navigation handling
app.setupNavigation(rootElement, async (url, params, files) => {
    try {
        const content = await app.loadRoute(url, 'GET', params, files);
        rootElement.innerHTML = content;
    } catch (error) {
        if (error instanceof RouteNotFoundError) {
            rootElement.innerHTML = '<h1>404 - Page Not Found</h1>';
        } else if (error instanceof ExternalRedirectError) {
            window.location.href = error.url;
        }
    }
});

// Load initial route
app.loadRoute('/', 'GET').then(content => {
    rootElement.innerHTML = content;
});
```

### Extending the Library

To add new features to the core library:

1. Add the feature implementation to `bottle-core.js`
2. Update the Skulpt wrapper in `bottle.js` to expose the feature to Python
3. Maintain backward compatibility with existing code

Example of adding a new method:

```javascript
// In bottle-core.js
class BottleCore {
    // ... existing methods ...
    
    addMiddleware(middleware) {
        // Implementation
    }
}

// In bottle.js
$loc.use_middleware = new Sk.builtin.func(function(self, middleware) {
    // Convert Python middleware to JS function
    const jsMiddleware = (request) => {
        // Call Python function and handle conversion
    };
    self.bottleCore$.addMiddleware(jsMiddleware);
});
```

## Integration with Other Python Implementations

The core library can be wrapped for other Python-to-JavaScript implementations:

### For Brython:
```python
from browser import window

BottleCore = window.BottleCore

class Bottle:
    def __init__(self):
        self._core = BottleCore.new()
    
    def route(self, path, verb='GET'):
        def decorator(func):
            self._core.addRoute(path, verb, func)
            return func
        return decorator
```

### For Pyodide:
```python
import js

class Bottle:
    def __init__(self):
        self._core = js.BottleCore.new()
    
    def route(self, path, verb='GET'):
        def decorator(func):
            self._core.addRoute(path, verb, func)
            return func
        return decorator
```

## API Reference

### BottleCore

**Constructor:**
- `new BottleCore()` - Creates a new Bottle application instance

**Methods:**
- `addRoute(path, verb, callback)` - Register a route
  - `path` (string): URL path (e.g., "/", "/about")
  - `verb` (string): HTTP verb ("GET" or "POST")
  - `callback` (Function): Async function that returns page content

- `addErrorHandler(code, callback)` - Register an error handler
  - `code` (number): HTTP error code
  - `callback` (Function): Error handler function

- `setRoot(element)` - Set the root DOM element
  - `element` (HTMLElement): Root element for the application

- `getRoot()` - Get the current root element
  - Returns: HTMLElement or null

- `loadRoute(url, method, parameters, files)` - Load and render a route
  - `url` (string): URL to load
  - `method` (string): HTTP method
  - `parameters` (Object): Query/form parameters
  - `files` (Object): Uploaded files
  - Returns: Promise<string> - Rendered page content

- `parseUrl(url)` - Parse a URL and extract components
  - `url` (string): URL to parse
  - Returns: Object with `normalUrl`, `pathname`, and `params`

- `setupNavigation(target, navigationCallback)` - Setup navigation handling
  - `target` (HTMLElement): Element to attach navigation to
  - `navigationCallback` (Function): Callback when navigation occurs

- `getCurrentRequest()` - Get the current request object
  - Returns: RequestCore or null

### RequestCore

**Constructor:**
- `new RequestCore(url, method, params, files)` - Creates a request object

**Properties:**
- `url` (string): Request URL
- `method` (string): HTTP method
- `params` (Object): Request parameters
- `files` (Object): Uploaded files
- `body` (string): Request body
- `headers` (Object): Request headers

### FileUploadCore

**Constructor:**
- `new FileUploadCore(filename, fileHandle)` - Creates a file upload wrapper

**Methods:**
- `read()` - Read file contents as bytes
  - Returns: Promise<Uint8Array>

### BottleUtils

**Methods:**
- `abort(code, message)` - Abort with an error
  - `code` (number): Error code
  - `message` (string): Error message
  - Throws: BottleAbortError

- `staticFile(path, root, mimetype)` - Serve a static file (placeholder)
  - `path` (string): File path
  - `root` (string): Root directory
  - `mimetype` (string): MIME type

## Design Principles

1. **Framework Agnostic**: Core library has no dependencies on Skulpt or any Python implementation
2. **Browser First**: Designed for modern browser environments
3. **Async/Await**: Uses modern JavaScript async patterns
4. **Extensible**: Easy to add new features and extend functionality
5. **Type Safe**: Can be easily converted to TypeScript if needed

## Future Enhancements

Potential features that could be added:

- TypeScript definitions
- Middleware support
- Template rendering
- Session management
- Cookie handling
- AJAX request handling
- WebSocket support
- Route parameters (e.g., `/user/:id`)
- Request validation
- Response object with status codes and headers

## Migration Guide

If you have existing Bottle code in Skulpt, no changes are needed. The wrapper maintains full backward compatibility. The refactoring is internal and transparent to users.

## Contributing

When contributing to the core library:

1. Keep it framework-agnostic (no Skulpt dependencies)
2. Use standard JavaScript (ES6+)
3. Document all public APIs
4. Maintain backward compatibility
5. Add tests for new features
6. Update both the core library and Skulpt wrapper

## License

This library inherits the license from the Skulpt project.
