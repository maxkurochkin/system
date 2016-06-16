import os
import mimetypes


class FileReader():
    chunk_size = 1024
    default_file_name = 'index.html'

    def __init__(self, path):
        self.type = None
        self._file = None
        self._path = path
        self._open()

    def read(self):
        while not self._file is None:
            data = self._file.read(self.chunk_size)
            if not data:
                self._close()
            yield data

    def check(self):
        if self._file is None:
            return False
        return True

    def _get_type(self):
        extension = self._get_extension()
        if extension is None:
            return None
        if extension in mimetypes.types_map:
            return mimetypes.types_map[extension]
        return None

    def _get_extension(self):
        path = os.path.splitext(self._path)
        if len(path) < 2:
            return None
        return path[1]

    def _open(self):
        if os.path.isdir(self._path):
            if not self._path.endswith('/'):
                self._path += '/'
            self._path += self.default_file_name
        if os.path.isfile(self._path):
            self._file = open(self._path, 'rb')
            self.type = self._get_type()

    def _close(self):
        if not self._file is None:
            self._file.close()
            self._file = None
