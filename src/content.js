import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './resources/jquery';
import './resources/inboxsdk';

const containerName = 'gmail-send-voice-record';

const initRecordingReactApp = (container, composeId) => {
  render(<App composeId={composeId} />, container, function () {});
};

const createDiv = (buttonElement, composeId) => {
  const container = window.document.createElement('div');
  container.id = containerName;
  $(buttonElement).append(container);
  initRecordingReactApp(container, composeId);
};

const loadInboxSDK = () => {
  InboxSDK.load(2, 'sdk_AutoShowFields_7f106636c4').then((sdk) => {
    sdk.Compose.registerComposeViewHandler(async (composeView) => {
      const composeId = new Date().getTime();

      composeView.addButton({
        title: 'Record Voice',
        iconClass: 'gmail-send-voice-record-icon',
        iconUrl: chrome.runtime.getURL('resources/microphone.svg'),
        onClick: function (event) {
          chrome.runtime.sendMessage({
            type: 'startRecording',
            data: { composeView, composeId },
          });
        },
      });

      const element = composeView.getElement();
      const buttonDiv = $(element).find('.inboxsdk__compose_actionToolbar');
      console.log({ buttonDiv });
      createDiv(buttonDiv, composeId);

      const attachRecording = (data) => {
        // const { recordedTime, composeView } = data;

        var superBuffer = new Blob([1, 2, 3, 4, 5, 6]);
        superBuffer.name = 'my_first_voice_in_gmail.txt';
        composeView.attachFiles([superBuffer]);
      };

      chrome.runtime.onMessage.addListener(function (
        message,
        sender,
        sendResponse
      ) {
        if (
          message.type === 'attachRecording' &&
          message.data.composeId === composeId
        ) {
          attachRecording(message.data);
        }
      });

      composeView.on('presending', (e) => {
        alert('presending');
      });

      composeView.on('discard', () => {});

      composeView.on('destroy', () => {});
    });
  });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
