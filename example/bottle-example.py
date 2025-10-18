"""
Bottle Example for Skulpt
This demonstrates how to use the Bottle module in Skulpt.
The bottle.js module wraps the bottle-core.js library.
"""

import bottle

# Create a Bottle application
app = bottle.Bottle()

# Define routes using the route decorator pattern
# (Note: In current implementation, routes are registered via app.route() method)

# Home page route
def home():
    return """
    <h1>Welcome to Skulpt Bottle!</h1>
    <p>This is a Python web application running in your browser.</p>
    <p>Navigate to:</p>
    <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/hello">Hello</a></li>
    </ul>
    """

app.route("/", "GET", home)

# About page route
def about():
    return """
    <h1>About Skulpt Bottle</h1>
    <p>This application uses:</p>
    <ul>
        <li><strong>Skulpt</strong>: Python-to-JavaScript compiler</li>
        <li><strong>Bottle Core</strong>: Framework-agnostic routing library</li>
        <li><strong>Bottle Module</strong>: Skulpt wrapper for Bottle Core</li>
    </ul>
    <p><a href="/">Back to Home</a></p>
    """

app.route("/about", "GET", about)

# Hello page with request parameters
def hello():
    # Access request parameters (if any)
    params = bottle.request.params
    name = params.get("name", "World")
    
    return f"""
    <h1>Hello, {name}!</h1>
    <p>This page demonstrates parameter handling.</p>
    <p>Try: <a href="/hello?name=Python">/hello?name=Python</a></p>
    <p><a href="/">Back to Home</a></p>
    """

app.route("/hello", "GET", hello)

# Error handler example
def error404(code):
    return """
    <h1>404 - Page Not Found</h1>
    <p>The requested page could not be found.</p>
    <p><a href="/">Back to Home</a></p>
    """
app.error(404, error404)

# Run the application
# This will set up the Bottle application in the browser
app.run()
