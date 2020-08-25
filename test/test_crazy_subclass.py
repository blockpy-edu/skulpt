class A:
    def __init__(self):
        print("Never Reached")

class B(A):
    def __init__(self):
        self.lower_method()
        super().__init__()

    def lower_method(self):
        print("I expect to be clobbered.")

class C(B):
    def __init__(self):
        super().__init__()

    def lower_method(self):
        print("I reset the scope, ha ha ha!")

C()