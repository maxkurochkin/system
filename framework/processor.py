from router import Router
from request import RequestBuilder
from response import JsonResponse, FileResponse
from file import FileReader


class Processor(object):
    @staticmethod
    def run(connection, data):
        request = RequestBuilder.build(data)
        function = Router.get_function(request.path)
        static = Router.get_static(request.path)
        print request.path
        if function is not None:
            try:
                Processor._send_function_result(connection, request, function)
            except Exception as e:
                Processor._send_500(connection, str(e))
        elif static is not None:
            Processor._send_file(connection, request, static)
        else:
            Processor._send_404(connection)
        connection.close()

    @staticmethod
    def _send_function_result(connection, request, function):
        response = function(request)
        http_response = response.get_http()
        connection.send(http_response)

    @staticmethod
    def _send_file(connection, request, static):
        path = static.folder + request.path[len(static.route):]
        file_reader = FileReader(path)
        if not file_reader.check():
            Processor._send_404(connection)
            return None
        http_header = FileResponse()
        if file_reader.type is not None:
            http_header.set_header('Content-type', file_reader.type)
        connection.send(http_header.get_http())
        for part in file_reader.read():
            connection.send(part)

    @staticmethod
    def _send_404(connection):
        response = JsonResponse()
        response.status = 404
        response.content = {'message': '404 Not Found'}
        http_response = response.get_http()
        connection.send(http_response)

    @staticmethod
    def _send_500(connection, message):
        response = JsonResponse()
        response.status = 500
        response.content = {'message': message}
        http_response = response.get_http()
        connection.send(http_response)
