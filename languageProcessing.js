function analyzeText(text) {
  return new Promise((resolve, reject) => {
    const requestUrl = [
      "https://language.googleapis.com/v1/documents:analyzeEntities?key=",
      "AIzaSyADeFluX6JmUaFcjWewHHd80Tyl-3xAJw8"
    ].join("");

    const data = {
      document: {
        type: "PLAIN_TEXT",
        language: "EN",
        content: text
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
        console.log(res);
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
            (res["entities"][i].type === "CONSUMER_GOOD" ||
              res["entities"][i].type === "LOCATION" ||
              res["entities"][i].type === "WORK_OF_ART") &&
            !res["entities"][i].name.toLowerCase().includes("product") &&
            (res["entities"][i].mentions.length > 1 ||
              res["entities"][i].salience > 0.1)
          ) {
            item = res["entities"][i].name;
          }
          i++;
        }
        // Only using the item right now, could use org too
        resolve(item);
      });
    });
  });
}
