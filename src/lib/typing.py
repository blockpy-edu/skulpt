

class Optional:
    def __class_getitem__(self, key):
        return self

class Union:
    def __class_getitem__(self, key):
        return self

class List:
    def __class_getitem__(self, key):
        return self

class Dict:
    def __class_getitem__(self, key):
        return self
