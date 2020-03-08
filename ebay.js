const baseURL = 'https://onyx-elevator-270422.appspot.com/';
const parameters = {
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': 'ebayhack-ecoBay-PRD-669e8f5f8-11393d83',
    'GLOBAL-ID': 'EBAY-US',
    'RESPONSE-DATA-FORMAT': 'JSON',
    'keywords': 'batman',
    'results': 3,
};

function getURL(baseURL, parameters) {
    let url = new URL(baseURL);
    for (let [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value);
    }
    return url.href;
}

function getData(url) {
    fetch(url)
        .then((response) => (response.json()))
        .then((json) => (console.log(json)));
}

function findItemsByKeywords(keyword, results) {
    let parameters = {
        'OPERATION-NAME': 'findItemsByKeywords',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': 'ebayhack-ecoBay-PRD-669e8f5f8-11393d83',
        'GLOBAL-ID': 'EBAY-US',
        'RESPONSE-DATA-FORMAT': 'JSON',
        'keywords': keyword,
        'paginationInput.entriesPerPage': results,
    }
    let url = getURL(baseURL, parameters);
    return getData(url);
}
