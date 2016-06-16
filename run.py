import settings
import framework
import urls


framework.Server.address = settings.SERVER_ADDRESS
framework.Server.port = settings.SERVER_PORT
framework.Server.start()
