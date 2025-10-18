/**
 * Bottle Core Library
 * 
 * A pure JavaScript implementation of a lightweight web framework
 * similar to Python's Bottle framework, designed to work in browser environments.
 * This library is framework-agnostic and can be wrapped by any Python-to-JS
 * implementation (Skulpt, Brython, etc.) or used directly in JavaScript.
 * 
 * Core Features:
 * - Route management (GET/POST)
 * - Navigation handling with event delegation
 * - URL and parameter parsing
 * - Form data processing
 * - File upload handling
 * - Request/response model
 * - Error handling
 */

/**
 * Core Bottle class - manages routes and requests
 */
class BottleCore {
    constructor() {
        this.routes = { GET: {}, POST: {} };
        this.errorHandlers = {};
        this.root = null;
        this.currentRequest = null;
        this.navigationHandler = null;
    }

    /**
     * Register a route with a callback
     * @param {string} path - URL path (e.g., "/", "/about")
     * @param {string} verb - HTTP verb ("GET" or "POST")
     * @param {Function} callback - Function to call when route is accessed
     */
    addRoute(path, verb, callback) {
        this.routes[verb][path] = callback;
    }

    /**
     * Register an error handler for a specific error code
     * @param {number} code - HTTP error code
     * @param {Function} callback - Error handler function
     */
    addErrorHandler(code, callback) {
        this.errorHandlers[code] = callback;
    }

    /**
     * Set the root DOM element for the application
     * @param {HTMLElement} element - Root element
     */
    setRoot(element) {
        this.root = element;
    }

    /**
     * Get the current root element
     * @returns {HTMLElement|null}
     */
    getRoot() {
        return this.root;
    }

    /**
     * Load and render a specific route
     * @param {string} url - URL to load
     * @param {string} method - HTTP method (GET/POST)
     * @param {Object} parameters - Query/form parameters
     * @param {Object} files - Uploaded files
     * @returns {Promise<string>} - Rendered page content
     */
    async loadRoute(url, method, parameters = {}, files = {}) {
        // Parse URL
        const urlInfo = this.parseUrl(url);
        
        // Merge URL query parameters with provided parameters
        const allParams = { ...urlInfo.params, ...parameters };
        
        // Create request object
        this.currentRequest = new RequestCore(urlInfo.normalUrl, method, allParams, files);
        
        // Find route
        const routeCallback = this.routes[method][urlInfo.pathname];
        
        if (!routeCallback) {
            // Check if external URL
            if (urlInfo.normalUrl.startsWith("http")) {
                // External redirect - handled by caller
                throw new ExternalRedirectError(urlInfo.normalUrl);
            } else {
                throw new RouteNotFoundError(`Route not found: ${urlInfo.pathname}`);
            }
        }
        
        // Execute route callback and get page content
        const pageContent = await routeCallback();
        return pageContent;
    }

    /**
     * Parse a URL and extract components
     * @param {string} url - URL string
     * @returns {Object} - Object with normalUrl, pathname, and params
     */
    parseUrl(url) {
        let normalUrl = url;
        
        // Normalize URL
        if (!normalUrl.startsWith("http") && !normalUrl.startsWith("file")) {
            normalUrl = "https://localhost" + normalUrl;
        }
        
        const fullUrl = new URL(normalUrl);
        const params = {};
        
        // Extract query parameters
        fullUrl.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        
        return {
            normalUrl,
            pathname: fullUrl.pathname,
            params
        };
    }

    /**
     * Setup navigation handling for a target element
     * @param {HTMLElement} target - Element to attach navigation to
     * @param {Function} navigationCallback - Callback when navigation occurs
     */
    setupNavigation(target, navigationCallback) {
        // Remove old handler if exists
        if (this.navigationHandler) {
            target.removeEventListener("click", this.navigationHandler);
        }
        
        // Create new handler
        this.navigationHandler = (event) => {
            // Allow download links to work normally
            if (event.target.matches("a[download]")) {
                return;
            }
            
            // Handle regular links
            if (event.target.matches("a")) {
                event.preventDefault();
                return navigationCallback(event.target.href, {});
            }
            
            // Handle form submissions
            if (event.target.matches('input[type="submit"]') ||
                event.target.matches('button[type="submit"]')) {
                event.preventDefault();
                const closestForm = event.target.closest("form");
                const formAction = event.target.getAttribute("formaction");
                
                if (closestForm) {
                    const formData = new FormData(closestForm, event.target);
                    const data = {};
                    const files = {};
                    
                    // Separate regular fields from file uploads
                    for (const [key, value] of formData.entries()) {
                        if (value instanceof File) {
                            files[key] = value;
                        } else {
                            data[key] = value;
                        }
                    }
                    
                    return navigationCallback(formAction, data, files);
                }
            }
        };
        
        target.addEventListener("click", this.navigationHandler);
    }

    /**
     * Get the current request object
     * @returns {RequestCore|null}
     */
    getCurrentRequest() {
        return this.currentRequest;
    }
}

/**
 * Request class - represents an HTTP request
 */
class RequestCore {
    constructor(url, method, params = {}, files = {}) {
        this.url = url;
        this.method = method;
        this.params = params;
        this.files = files;
        this.body = "";
        this.headers = {};
    }
}

/**
 * File upload wrapper
 */
class FileUploadCore {
    constructor(filename, fileHandle) {
        this.filename = filename;
        this.fileHandle = fileHandle;
    }

    /**
     * Read file contents as bytes
     * @returns {Promise<Uint8Array>}
     */
    async read() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function() {
                const bytes = new Uint8Array(this.result);
                resolve(bytes);
            };
            reader.onerror = function() {
                reject(new Error("Failed to read file"));
            };
            reader.readAsArrayBuffer(this.fileHandle);
        });
    }
}

/**
 * Custom error types
 */
class RouteNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "RouteNotFoundError";
    }
}

class ExternalRedirectError extends Error {
    constructor(url) {
        super(`External redirect to: ${url}`);
        this.name = "ExternalRedirectError";
        this.url = url;
    }
}

class BottleAbortError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "BottleAbortError";
        this.code = code;
    }
}

/**
 * Utility functions
 */
const BottleUtils = {
    /**
     * Abort with an error code and message
     * @param {number} code - Error code
     * @param {string} message - Error message
     */
    abort(code, message) {
        throw new BottleAbortError(code, message);
    },
    
    /**
     * Serve a static file (placeholder - typically handled by server)
     * @param {string} path - File path
     * @param {string} root - Root directory
     * @param {string} mimetype - MIME type
     */
    staticFile(path, root, mimetype) {
        // This is a placeholder - static file serving would typically
        // be handled by the server or a separate mechanism
        console.log("Static file request:", { path, root, mimetype });
    }
};

// Export for use in module systems or direct inclusion
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BottleCore,
        RequestCore,
        FileUploadCore,
        RouteNotFoundError,
        ExternalRedirectError,
        BottleAbortError,
        BottleUtils
    };
}

// Also export to global scope for direct browser usage
if (typeof window !== 'undefined') {
    window.BottleCore = BottleCore;
    window.RequestCore = RequestCore;
    window.FileUploadCore = FileUploadCore;
    window.RouteNotFoundError = RouteNotFoundError;
    window.ExternalRedirectError = ExternalRedirectError;
    window.BottleAbortError = BottleAbortError;
    window.BottleUtils = BottleUtils;
}
