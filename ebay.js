const baseURL = 'https://onyx-elevator-270422.appspot.com/';


function getURL(parameters) {
    let url = new URL(baseURL);
    for (let [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value);
    }
    return url.href;
}

function getJSON(url) {
    console.log(url);
    return fetch(url).then((response) => (response.json()))
}

// Searchs eBay for items that match the given keyword. Returns these in an
// array of objects.
//
// REQUIRED PARAMS:
// keyword (string): the keywords to search for items with. this can be multiple
// words, just put a space between them in a single string
// results (integer): number of results to return
// 
// OPTIONAL PARAMS:
// postalCode (integer): the postal code of the buyer
// maxRadius (integer): the maximum radius around the postalCode to search for
function findItemsByKeywordsAndRadius(keyword, results, postalCode, maxRadius) {
    let parameters = {
        'OPERATION-NAME': 'findItemsByKeywords',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': 'ebayhack-ecoBay-PRD-669e8f5f8-11393d83',
        'GLOBAL-ID': 'EBAY-US',
        'RESPONSE-DATA-FORMAT': 'JSON',
        'keywords': keyword,
        'paginationInput.entriesPerPage': results,
    }

    if (postalCode && maxRadius) {
        parameters['buyerPostalCode'] = postalCode;
        parameters['itemFilter(0).name'] = 'LocalSearchOnly';
        parameters['itemFilter(0).value'] = true;
        parameters['itemFilter(1).name'] = 'MaxDistance';
        parameters['itemFilter(1).value'] = 100;
    }

    let url = getURL(parameters);
    return getJSON(url).then((raw) => {
        let rawItems = raw.findItemsByKeywordsResponse[0].searchResult[0].item;
        let newItems = [];
        for (let item of rawItems) {
            newItems.push({
                'title': item.title[0],
                'imageURL': item.galleryURL[0],
                'location': item.location[0],
                'price': parseInt(item.sellingStatus[0].currentPrice[0].__value__),
                'itemURL': item.viewItemURL[0],
            });
        }
        return newItems;
    });
}

function findItemsByKeywords(keyword, results) {
    return findItemsByKeywordsAndRadius(keyword, results, null, null);
}

/*
EXAMPLE: prints out the top 5 results for 'shoes' on eBay:

findItemsByKeywords('shoes', 5).then((items) => {
    for (let item of items) {
        console.log(item);
    }
});

EXAMPLE: prints out the top 5 results for 'batman', with a radius of 10 miles
around the Zip Code 98195.

findItemsByKeywordsAndRadius('batman', 5, 98195, 10).then((items) => {
    for (let item of items) {
        console.log(item);
    }
});
*/
