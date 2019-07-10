"""
A package for analyzing student code.
"""

# Probably want to import useful stuff from:
#   report
#   source
#   sandbox
#   tifa
#   cait
#   resolver
#   etc.

import time; stopwatch = time.time();

from pedal.cait import (find_match, find_matches,
                        parse_program,
                        find_submatches, find_expr_sub_matches,
                        def_use_error, data_state, data_type,
                        expire_cait_cache)
print("Phase {}: {} secs".format("Cait loaded", round(time.time() - stopwatch, 2))) ; stopwatch = time.time()
from pedal.report.imperative import (suppress, explain, compliment,
                                     give_partial, gently, set_success)
print("Phase {}: {} secs".format("Imperative loaded", round(time.time() - stopwatch, 2))) ; stopwatch = time.time()
from pedal.sandbox.sandbox import run, reset
print("Phase {}: {} secs".format("Sandbox loaded", round(time.time() - stopwatch, 2))) ; stopwatch = time.time()
from pedal.tifa import tifa_analysis
print("Phase {}: {} secs".format("Tifa loaded", round(time.time() - stopwatch, 2))) ; stopwatch = time.time()
from pedal.source import (set_source, check_section_exists, next_section,
                          set_source_file)
print("Phase {}: {} secs".format("Source loaded", round(time.time() - stopwatch, 2))) ; stopwatch = time.time()
