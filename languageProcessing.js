document.addEventListener(
  "DOMContentLoaded",
  function() {
    var checkPageButton = document.getElementById("checkPage");
    checkPageButton.addEventListener(
      "click",
      function() {
        chrome.tabs.getSelected(null, function(tab) {
          analyzeText(chrome);
        });
      },
      false
    );
  },
  false
);

function analyzeText() {
  const requestUrl = [
    "https://language.googleapis.com/v1/documents:analyzeEntities?key=",
    "AIzaSyADeFluX6JmUaFcjWewHHd80Tyl-3xAJw8"
  ].join("");

  const data = {
    document: {
      type: "PLAIN_TEXT",
      language: "EN",
      content:
        "Google, headquartered in Mountain View (1600 Amphitheatre Pkwy, Mountain View, CA 940430), unveiled the new Android phone for $799 at the Consumer Electronic Show. Sundar Pichai said in his keynote that users love their new Android phones."
    }
  };

  fetch(requestUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(fetched => {
    fetched.json().then(res => {
      // const printableResult = JSON.stringify(res);
      let org;
      let item;
      let i = 0;
      while (
        i < res["entities"].length &&
        (typeof org === "undefined" || typeof item === "undefined")
      ) {
        if (
          typeof org === "undefined" &&
          res["entities"][i].type === "ORGANIZATION"
        ) {
          org = res["entities"][i].name;
        }
        if (
          typeof item === "undefined" &&
          res["entities"][i].type === "CONSUMER_GOOD"
        ) {
          item = res["entities"][i].name;
        }
        i++;
      }
      // TODO: Use org and item
      document.body.innerHTML += "<h1>" + org + "</h1>";
      document.body.innerHTML += "<h1>" + item + "</h1>";
    });
  });
}
