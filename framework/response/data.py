import json
from helper import ResponseHttpHelper


class HttpResponse(object):
    def __init__(self):
        self._header_list = {}
        self.status = 200
        self.content = None

    def get_http(self):
        self._set_default_headers()
        data = self._get_http_header()
        data += str(self.content)
        return data

    def get_header(self, name):
        if name in self._header_list:
            return self._header_list[name]
        return None

    def set_header(self, name, value):
        self._header_list[name] = value

    def _get_http_header(self):
        data = ResponseHttpHelper.get_status_line(self.status)
        for name in self._header_list:
            value = self._header_list[name]
            data += ResponseHttpHelper.get_header_line(name, value)
        data += ResponseHttpHelper.get_end_line()
        return data

    def _set_default_headers(self):
        if self.get_header('Content-type') is None:
            self.set_header(
                'Content-type',
                'text/html; charset=utf-8'
            )


class JsonResponse(HttpResponse):
    def get_http(self):
        self._set_default_headers()
        data = self._get_http_header()
        data += json.dumps(self.content)
        return data

    def _set_default_headers(self):
        if self.get_header('Content-type') is None:
            self.set_header(
                'Content-type',
                'application/json; charset=utf-8'
            )


class FileResponse(HttpResponse):
    def get_http(self):
        self._set_default_headers()
        return self._get_http_header()

    def _set_default_headers(self):
        if self.get_header('Content-type') is None:
            self.set_header(
                'Content-type',
                'application/octet-stream'
            )
