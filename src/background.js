const refreshPage = () => {
  chrome.tabs.query(
    {
      url: '*://mail.google.com/*',
    },
    function (tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.update(tab.id, { url: tab.url });
      });
    }
  );
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'attachRecording':
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
      break;
    case 'startRecording':
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
      break;
  }
});

const sendMessageToRuntime = (message) => {
  chrome.runtime.sendMessage({ ...message });
};

chrome.runtime.onInstalled.addListener(function (details) {
  refreshPage();
});
