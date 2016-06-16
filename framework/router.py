class Router(object):
    _function_list = {}
    _folder_list = {}

    @staticmethod
    def get_function(path):
        if path in Router._function_list:
            return Router._function_list[path]
        return None

    @staticmethod
    def get_static(path):
        longest_route = None
        for route in Router._folder_list:
            if path.startswith(route):
                if longest_route is None \
                or len(longest_route) < len(route):
                    longest_route = route

        if longest_route is None:
            return None

        static = Static()
        static.route = longest_route
        static.folder = Router._folder_list[longest_route]
        return static

    @staticmethod
    def set_function(route, function):
        Router._function_list[route] = function

    @staticmethod
    def set_folder(route, folder):
        Router._folder_list[route] = folder


class Static(object):
    def __init__(self):
        self.route = None
        self.folder = None
