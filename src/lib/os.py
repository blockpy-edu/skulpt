import sys

import posixpath as path

sys.modules['os.path'] = path

environ = sys._environ

# raise NotImplementedError("os is not yet implemented in Skulpt")
