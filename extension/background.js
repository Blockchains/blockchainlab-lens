importScripts("detect.js");
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "bl-explain", title: "Explain “%s” with Blockchain Lab", contexts: ["selection"] });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let chain = "ethereum"; try { chain = BLLens.detect(tab.url)?.chain || "ethereum"; } catch {}
  const url = BLLens.fromText(info.selectionText || "", chain);
  chrome.tabs.create({ url: url || `${BLLens.TOOLS}/?utm_source=blockchainlab-lens` });
});
