from django.http import HttpResponse
from django.views.decorators.http import require_GET

import urllib.request
from urllib.parse import urlencode
import json


# the security-appname is sensitive, keep it safe
APP_NAME = ''

PARAMETERS = {
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': APP_NAME,
    'GLOBAL-ID': 'EBAY-US',
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': 'N/A',
}


def build_url(keywords, results):
    base_url = 'https://svcs.ebay.com/services/search/FindingService/v1?'
    new_parameters = PARAMETERS.copy()
    new_parameters['keywords'] = keywords
    new_parameters['results'] = results
    return f'{base_url}{urlencode(new_parameters)}'


@require_GET
def find_items(request):
    keywords = request.GET.get('keywords', '')
    results = request.GET.get('results', 0)
    ebay_url = build_url(keywords, results)

    with urllib.request.urlopen(ebay_url) as url:
        data = url.read().decode()
        return HttpResponse(data, content_type='application/json')
