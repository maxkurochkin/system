import socket
from processor import Processor


class Server(object):
    address = '127.0.0.1'
    port = 8012
    connection_count = 16
    packet_size = 1024
    _socket = None
    
    @staticmethod
    def start():
        Server._connect()
        Server._loop()

    @staticmethod
    def stop():
        Server._close_socket()

    @staticmethod
    def restart():
        Server.stop()
        Server.start()
    
    @staticmethod
    def _connect():
        Server._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        Server._socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        Server._socket.bind((Server.address, Server.port))
        Server._socket.listen(Server.connection_count)

    @staticmethod
    def _loop():
        while not Server._socket is None:
            connection, address = Server._socket.accept()
            data = Server._receive_data(connection)
            Processor.run(connection, data)

    @staticmethod
    def _receive_data(connection):
        data = ''
        while True:
            part = connection.recv(Server.packet_size)
            lenght = len(part)
            if lenght > 0:
                data += part.decode('utf-8')
            if lenght < Server.packet_size:
                return data

    @staticmethod
    def _close_socket():
        if not Server._socket is None:
            Server._socket.close()
            Server._socket = None
