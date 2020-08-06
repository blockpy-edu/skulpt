import hashlib


assert hashlib.md5("abc".encode('utf-8')).digest()[0] == 144

assert hashlib.md5("cory bart".encode('utf-8')).digest()[0] == 135

assert hashlib.md5("Dr. m'banana".encode('utf-8')).digest()[0] == 136

print("All done!")