import {
  formatDomain,
  loadStrageArray,
  openPinnedTabs,
  uniqArray,
} from "../module/commonFunctions.js";

function saveOptions(_e, url = null) {
  const inputvalue = url ||
    formatDomain(document.getElementById("urlInput").value);
  if (inputvalue.length) {
    const values = loadStrageArray("urls");
    values.push(inputvalue);
    localStorage.setItem("urls", JSON.stringify(values, undefined, 1));
    recreateList();
    openPinnedTabs();
  }
  focusOnInput();
}

function deleteElement(_e) {
  const list = loadStrageArray("urls");
  list.splice(list.indexOf(this.url), 1);
  localStorage.setItem("urls", JSON.stringify(list, undefined, 1));
  recreateList();
}

function recreateList() {
  const list = document.getElementById("list");
  // リスト内を空にする
  list.innerHTML = "";
  const values = loadStrageArray("urls");
  for (const url of values) {
    // リスト内に要素を作成
    const container = document.createElement("div");
    container.setAttribute("class", "flex-container listitem");
    list.appendChild(container);
    // 要素内にurl表示部分を作成
    const listItem = document.createElement("div");
    listItem.appendChild(document.createTextNode(url));
    listItem.setAttribute("class", "page-choice");
    container.appendChild(listItem);
    // 要素内に削除ボタンを作成
    const deleteButton = document.createElement("a");
    deleteButton.appendChild(document.createTextNode("✕"));
    deleteButton.addEventListener("click", {
      url: url,
      handleEvent: deleteElement,
    });
    deleteButton.setAttribute("class", "deleteButton");
    container.appendChild(deleteButton);
  }
  return;
}

function focusOnInput() {
  document.getElementById("urlInput").focus();
}

async function getPinnedTabs(e) {
  let discovered_tabs = [];
  await chrome.tabs.query({ pinned: true }, (e) => {
    discovered_tabs = e;
  });
  for (const tab of discovered_tabs) {
    saveOptions(e, formatDomain(tab.url));
  }
}

// ------------------------------------------------------------

window.onload = function () {
  document.querySelector("form").addEventListener("submit", saveOptions);
  document
    .getElementById("loadButton")
    .addEventListener("click", getPinnedTabs);
  recreateList();
  focusOnInput();
};
