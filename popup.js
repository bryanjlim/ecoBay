document.addEventListener(
  "DOMContentLoaded",
  function() {
    var checkPageButton = document.getElementById("checkPage");
    checkPageButton.addEventListener(
      "click",
      function() {
        chrome.tabs.executeScript(
          null,
          {
            file: "getPagesSource.js"
          },
          function() {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
              message.innerText =
                "There was an error injecting script : \n" +
                chrome.runtime.lastError.message;
            }
          }
        );
      },
      false
    );
  },
  false
);

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    if (request.source.found) {
      message.innerText = request.source.val;
    } else {
      analyzeText(request.source.val).then(processedItem => {
        message.innerText = processedItem;
        let numResults = 10;
        findItemsByKeywords(processedItem, numResults).then((items) => {
          for (let item in items) {
            // do something with each item
          }
        });
      });
    }
  }
});

function addItems(items) {
  let cardDeck = document.getElementById('cardDeck');
  cardDeck.innerHTML = '';
  for (let item in items) {
    let newCard = getCard(item);
    cardDeck.appendChild(newCard);
  }
}

function getCard(item) {
  let image = document.createElement('img');
  image.setAttribute('src', item.imageURL);
  image.setAttribute('style', 'width: 100%;');
  let header = document.createElement('h1');
  header.innerHTML = item.title;
  let priceTag = document.createElement('p');
  priceTag.className = 'price';
  priceTag.innerHTML = `Price: $${item.price}`;
  let buyButton = document.createElement('button');
  buyButton.onclick = function() { window.location = item.itemURL };
  buyButton.innerHTML = 'Purchase on eBay';

  let newCard = document.createElement('div');
  newCard.className = 'card';
  newCard.appendChild(image);
  newCard.appendChild(header);
  newCard.appendChild(priceTag);
  newCard.appendChild(buyButton);

  return newCard;
}

console.log("WORK");
findItemsByKeywordsAndRadius('phone', 10, 95060, 10).then((items) => {
  addItems(items);
});
