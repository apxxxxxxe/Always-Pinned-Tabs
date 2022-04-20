function loadStrageArray(key) {
  // JSON形式で保存された配列を配列形式で返す関数
  // JSONからの変換に失敗した場合は空配列を返す
  function isValidJSON(data) {
    try {
      const value = JSON.parse(data);
      if (value === null) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }
  const values = localStorage.getItem(key);
  if (isValidJSON(values)) {
    return uniqArray(JSON.parse(values));
  } else {
    return [];
  }
}

function formatDomain(url) {
  let result = url;
  result = result.replace(/^https?:\/\//, "");
  result = result.replace(/^www\./, "");
  result = result.replace(/\/$/, "");
  result = result.replace(/\/.*$/, "");
  return result;
}

function uniqArray(array) {
  return Array.from(new Set(array));
}

async function openPinnedTabs() {
  let discovered_tabs = [];
  const urls = loadStrageArray("urls");
  for (const urll of urls) {
    await chrome.tabs.query({
      url: "*://*." + formatDomain(urll) + "/*",
      pinned: true,
      currentWindow: true,
    }, (e) => {
      discovered_tabs = e;
    });

    if (discovered_tabs.length != 0) {
      chrome.tabs.create({
        url: "http://" + url,
        pinned: true,
        active: false,
      });
    }
  }
}

export { formatDomain, loadStrageArray, openPinnedTabs, uniqArray };
