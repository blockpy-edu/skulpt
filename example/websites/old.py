import base64

print("B64E", base64.b64encode("HEllo world"))
print("B64D", base64.b64decode(base64.b64encode("HEllo world")))

import gzip

d = gzip.compress("Alpha".encode('utf-8'))
print("!!!", d)
print(gzip.decompress(d).decode('utf-8'))
print("ALL DONE")

print(gzip.decompress(base64.b64decode(base64.b64encode(d))).decode('utf-8'))

from urllib.parse import urlparse, parse_qs, urlencode

o = urlparse("http://docs.python.org:80/3/library/urllib.parse.html?"
             "highlight=params#url-parsing")
params = parse_qs(o.query)
print(o)
print(params)
print(urlencode({"apple": "sauce", "fruit": "banana"}))
print(o.geturl())
print("TEST")


from drafter import *
from dataclasses import dataclass


@dataclass
class State:
    username: str
    logged_in: bool

@route
def index(state: State) -> Page:
    if state.logged_in:
        body = [
            Header("Welcome to my site!"),
            "You are logged in as " + state.username + ".",
            Button("Log out", do_logout)
        ]
    else:
        body = [
            Header("Welcome to my site!"),
            "You are not logged in.",
            Button("Log in", ask_login)
        ]
    return Page(state, body)

@route
def ask_login(state: State) -> Page:
    return Page(state, [
        "What is your username?",
        TextBox("username", state.username),
        "What is your password?",
        TextBox("password"),
        SubmitButton("Log in", finish_login),
        SubmitButton("Go back", index)
    ])

def check_password(username: str, password: str) -> bool:
    # Protip: Real password checking looks nothing like this :)
    if username == "admin" and password == "password":
        return True
    elif username == "ada" and password == "lovelace":
        return True
    return False

@route
def finish_login(state: State, username: str, password: str) -> Page:
    state.username = username
    if check_password(username, password):
        state.logged_in = True
        return index(state)
    else:
        return reject_login(state)

@route
def reject_login(state: State) -> Page:
    return Page(state, [
        "Incorrect username or password.",
        SubmitButton("Go back", index)
    ])

@route
def do_logout(state: State) -> Page:
    state.logged_in = False
    return index(state)


start_server(State("", False))