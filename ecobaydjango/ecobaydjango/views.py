from django.http import HttpResponse
from django.views.decorators.http import require_GET

import urllib.request
from urllib.parse import urlencode
import json


@require_GET
def find_items_by_keyword(request):
    base_url = 'https://svcs.ebay.com/services/search/FindingService/v1?'
    ebay_url = f'{base_url}{urlencode(request.GET)}'
    with urllib.request.urlopen(ebay_url) as url:
        data = url.read().decode()
        response = HttpResponse(data, content_type='application/json')
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response
