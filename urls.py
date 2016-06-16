from framework import Router
from framework.response import JsonResponse


def test_controller(request):
	response = JsonResponse()
	response.content = {'test': 100}
	response.status = 200
	return response

Router.set_function('/sobaka/', test_controller)
Router.set_folder('/', 'static/desktop/')
Router.set_folder('/manager/', 'modules/manager/static/')
Router.set_folder('/console/', 'modules/console/static/')
