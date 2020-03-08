const baseURL = 'https://svcs.ebay.com/services/search/FindingService/v1?';
const parameters = {
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': 'ebayhack-ecoBay-PRD-669e8f5f8-11393d83',
    'GLOBAL-ID': 'EBAY-US',
    'RESPONSE-DATA-FORMAT': 'JSON',
    'keywords': 'batman',
    'results': 3,
};

getURL = (baseURL, parameters) => {
    let url = new URL(baseURL);
    for (let [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value);
    }
    return url.href;
}

fetch(getURL(baseURL, parameters))
    .then((response) => {
        console.log(response.json());
    })
    .then((data) => {
        console.log(data);
    });
