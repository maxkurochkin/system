class Request(object):
    def __init__(self):
        self._attribute_list = {}
        self.method = None
        self.path = None
        self.content = None

    def get_attribute(self, name):
        if name in self._attribute_list:
            return self._attribute_list[name]
        return None

    def set_attribute(self, name, value):
        self._attribute_list[name] = value
