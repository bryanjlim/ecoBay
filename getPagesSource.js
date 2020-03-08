function DOMtoString(document_root) {
  // Amazon item
  if (document.URL.toLowerCase().includes("amazon.com")) {
    var amazonItem = document_root.getElementById("title");
    if (typeof amazonItem != undefined) {
      return { found: true, val: amazonItem.innerText };
    }
  } else {
    // Non-Amazon item
    var html = "",
      node = document_root.body;
    html += getHtml(node);
    html = html.substr(0,750);
    return { found: false, val: html };
  }
}

function getHtml(node) {
  ret = "";
  while (node) {
    if (
      typeof node.className === "string" &&
      !node.className.toLowerCase().includes("recommendation") &&
      (node.className.toLowerCase().includes("product") ||
        node.className.toLowerCase().includes("title") ||
        node.className.toLowerCase().includes("heading"))
    ) {
      ret += node.innerText;
    }
    if (node.firstChild) {
      ret += getHtml(node.firstChild);
    }
    node = node.nextSibling;
  }
  return ret;
}

chrome.runtime.sendMessage({
  action: "getSource",
  source: DOMtoString(document)
});

// Helper Methods

function removeUnits(str) {
  str = str.toLowerCase();
  str = replaceAll(str, "fl oz", " ");
  str = replaceAll(str, "fluid ounce", " ");
  return str;
}

function replaceAll(original, str1, str2, ignore) {
  return original.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
}
