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
  analyzeText(request.source.val).then(keyword => {
    if (keyword == undefined) {
      message.innerText = "No local sellers found. Become one at eBay.com/sell";
    } else {
      message.innerText = keyword;
      handleEbayItems(keyword);
    }
  });
});

function handleEbayItems(keyword) {
  fetch("http://gd.geobytes.com/GetCityDetails").then(res => {
    res.json().then(ip => {
      fetch(
        "http://api.ipstack.com/" +
          ip.geobytesipaddress +
          "?access_key=f588b69a73ddab02d58b0bf76a5d6648"
      ).then(res2 => {
        res2.json().then(zipRes => {
          console.log(keyword);
          console.log(zipRes.zip);
          findItemsByKeywordsAndRadius(keyword, 5, zipRes.zip, 25).then(
            ebayItems => {
              addItems(ebayItems);
            }
          );
        });
      });
    });
  });
}

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
        findItemsByKeywords(processedItem, numResults).then(items => {
          for (let item in items) {
            // do something with each item
          }
        });
      });
    }
  }
});

function addItems(items) {
  let cardDeck = document.getElementById("cardDeck");
  cardDeck.innerHTML = "";
  if (items.length > 0) {
    for (let item of items) {
      let newCard = getCard(item);
      cardDeck.appendChild(newCard);
    }
  } else {
    let p = document.createElement("p");
    p.innerText = "No local sellers found. Become one at eBay.com/sell";
    cardDeck.appendChild(p);
  }
}

function getCard(item) {
  let image = document.createElement("img");
  image.setAttribute("src", item.imageURL);
  image.setAttribute("style", "width: 100%;");
  let header = document.createElement("h1");
  header.innerHTML = item.title;
  let priceTag = document.createElement("p");
  priceTag.className = "price";
  priceTag.innerHTML = `Price: $${item.price}`;
  let locationTag = document.createElement("p");
  locationTag.className = "price";
  locationTag.innerHTML = `Location: ${item.location}`;
  let buyButton = document.createElement("button");
  buyButton.innerHTML = "Purchase on eBay";
  buyButton.addEventListener("click", function() {
    chrome.tabs.create({
      url: item.itemURL,
      active: false
    });
  });

  let newCard = document.createElement("div");
  newCard.className = "card";
  newCard.appendChild(image);
  newCard.appendChild(header);
  newCard.appendChild(priceTag);
  newCard.appendChild(locationTag);
  newCard.appendChild(buyButton);
  return newCard;
}
