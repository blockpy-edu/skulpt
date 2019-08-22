def a_scope(propertyIsEnumerable, cat, length, banana):
    def inner_scope():
        cat+"meow"
        banana+"puffin"
        propertyIsEnumerable+"anything"
        length+"jango"
    return inner_scope


a_scope("ada", "pumpkin", "mittens", "pele")()