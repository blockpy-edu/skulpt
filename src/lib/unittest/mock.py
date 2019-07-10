def pass_through(*args, **kwargs):
    return pass_through(*args, **kwargs)

patch = pass_through
patch.dict = pass_through