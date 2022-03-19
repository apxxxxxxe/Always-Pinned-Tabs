import { loadStrageArray, formatDomain, uniqArray, openPinnedTabs } from '../module/commonFunctions.js';

function saveOptions(e, url=null) {
  let inputvalue = url || formatDomain(document.getElementById("urlInput").value);
  if (inputvalue.length) {
    let values = loadStrageArray('urls');
    values.push(inputvalue);
    localStorage.setItem('urls', JSON.stringify(values, undefined, 1));
    recreateList();
    openPinnedTabs();
  }
  focusOnInput();
}

function deleteElement(e) {
  let list = loadStrageArray('urls');
  list.splice(list.indexOf(this.url), 1);
  localStorage.setItem('urls', JSON.stringify(list, undefined, 1));
  recreateList();
}

function recreateList() {
  list = document.querySelector("#list");
  // リスト内を空にする
  list.innerHTML = "";
  const values = loadStrageArray('urls');
  for (const url of values) {
    // リスト内に要素を作成
    let container = document.createElement("div");
    container.setAttribute("class","flex-container listitem");
    list.appendChild(container);
    // 要素内にurl表示部分を作成
    let listItem = document.createElement("div");
    listItem.appendChild(document.createTextNode(url));
    listItem.setAttribute("class","page-choice");
    container.appendChild(listItem);
    // 要素内に削除ボタンを作成
    let deleteButton = document.createElement("a");
    deleteButton.appendChild(document.createTextNode("✕"));
    deleteButton.addEventListener('click', {url: url, handleEvent: deleteElement});
    deleteButton.setAttribute("class","deleteButton");
    container.appendChild(deleteButton);
  }
  return;
}

function focusOnInput() {
  document.getElementById("urlInput").focus();
}

async function getPinnedTabs(e) {
  let discovered_tabs = await browser.tabs.query({ pinned: true });
  for(const tab of discovered_tabs) {
    saveOptions(e, formatDomain(tab.url));
  }
}

// ------------------------------------------------------------

window.onload = function() {
  document.querySelector("form").addEventListener("submit", saveOptions);
  document.getElementById("loadButton").addEventListener('click', getPinnedTabs);
  recreateList();
  focusOnInput();
}

