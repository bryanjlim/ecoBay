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
