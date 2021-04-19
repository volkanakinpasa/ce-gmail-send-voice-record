const loadInboxSDK = () => {
  InboxSDK.load(2, 'sdk_AutoShowFields_7f106636c4').then((sdk) => {
    sdk.Compose.registerComposeViewHandler(async (composeView) => {
      // const element = composeView.getElement();

      composeView.on('presending', (e) => {
        alert('presending');
      });

      composeView.on('discard', () => {});

      composeView.on('destroy', () => {});

      composeView.addButton({
        title: 'Record Voice',
        iconClass: 'gmail-html-icon',
        iconUrl: chrome.runtime.getURL('resources/microphone.svg'),
        onClick: function (event) {
          alert('mic on click');
        },
      });
    });
  });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
