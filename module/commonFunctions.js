function loadStrageArray(key) {
  // JSON形式で保存された配列を配列形式で返す関数
  // JSONからの変換に失敗した場合は空配列を返す
  function isValidJSON(data) {
    try {
      let value = JSON.parse(data);
      if (value === null) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }
  let values = localStorage.getItem(key);
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
  let discovered_tabs;
  const urls = loadStrageArray('urls');
  for (let url of urls) {
    discovered_tabs = await browser.tabs.query({ url: "*://*." + formatDomain(url) + "/*", pinned: true, currentWindow: true });
    if (!discovered_tabs.length) {
      browser.tabs.create({
        url: "http://" + url,
        pinned: true,
        active: false
      });
    }
  }
}

export { loadStrageArray, formatDomain, uniqArray, openPinnedTabs };
