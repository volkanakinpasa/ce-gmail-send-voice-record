const refreshPage = () => {
  chrome.tabs.query(
    {
      url: '*://[mail|inbox].google.com/*',
    },
    function (tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.update(tab.id, { url: tab.url });
      });
    }
  );
};

chrome.runtime.onInstalled.addListener(function (details) {
  refreshPage();
});
