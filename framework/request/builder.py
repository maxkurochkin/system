from data import Request


class RequestBuilder(object):
    method_list = [
        'OPTIONS',
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'TRACE',
        'CONNECT'
    ]

    @staticmethod
    def build(data):
        request = Request()
        header = RequestBuilder._parse_header(data)
        request.content = RequestBuilder._parse_content(data)
        request.method = RequestBuilder._parse_method(header)
        request.path = RequestBuilder._parse_path(header)
        attribute_list = RequestBuilder._parse_get(header)
        if not attribute_list is None:
            for index in attribute_list:
                request.set_attribute(index, attribute_list[index])
        return request

    @staticmethod
    def _parse_header(data):
        return data.split('\r\n\r\n')[0]

    @staticmethod
    def _parse_content(data):
        data = data.split('\r\n\r\n')
        if len(data) < 2:
            return None
        return data[1]

    @staticmethod
    def _parse_method(header):
        data = header.split(' ')[0]
        if data in RequestBuilder.method_list:
            return data
        return None

    @staticmethod
    def _parse_path(header):
        data = header.split(' ')
        if len(data) < 2:
            return '/'
        data = data[1].split('?')[0]
        if len(data) > 0:
            return data
        return '/' 

    @staticmethod
    def _parse_get(header):
        data = header.split(' ')
        if len(data) < 2:
            return None
        data = data[1].split('?')
        if len(data) < 2:
            return None
        data = data[1].split('&')
        data = [item.split('=') for item in data]
        return dict(data)
