import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './resources/jquery';
import './resources/inboxsdk';

const containerName = 'gmail-send-voice-record';
const getVoxBoxSignature = () => {
  return `<a href="123" target="_blank">Email with voice</a><br/>
<a href="123" target="_blank">Download VoxBox extension</a>`;
};

const loadInboxSDK = () => {
  InboxSDK.load(2, 'sdk_AutoShowFields_7f106636c4').then((sdk) => {
    sdk.Compose.registerComposeViewHandler(async (composeView) => {
      const attachmentNamePrefix = 'VoxBox_';
      const attachmentNameExtension = '.webm';
      const composeId = new Date().getTime();
      let container = null;
      const element = composeView.getElement();
      let buttonElement = null;

      const initRecordingReactApp = () => {
        render(
          <App
            composeId={composeId}
            attachChunk={(recordedTime, composeId, chunk) => {
              attachChunk({ recordedTime, composeId, chunk });
            }}
          />,
          container,
          function () {}
        );
      };

      const createDiv = () => {
        container = window.document.createElement('div');
        container.id = containerName;
        $(buttonElement).append(container);
        initRecordingReactApp();
      };

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

      buttonElement = $(element).find('.inboxsdk__compose_actionToolbar');
      // console.log({ buttonDiv });
      createDiv();

      chrome.runtime.onMessage.addListener(function (message) {
        if (
          message.type === 'attachRecording' &&
          message.data.composeId === composeId
        ) {
          attachRecording(message.data);
        }
      });

      const attachRecording = async (data) => {
        const blobUrl = data.blobUrl;
        let blob = await fetch(blobUrl).then((r) => r.blob());
        // console.log('inside content.js', { blobUrl, blob });
        const dateIsoNAme = new Date().toISOString();
        // const blob = new Blob(chunk);
        blob.name = `${attachmentNamePrefix}${dateIsoNAme}${attachmentNameExtension}`;
        composeView.attachFiles([blob]);
      };

      composeView.on('presending', (e) => {
        //todo: send message and kill stream
        try {
          $(element)
            .find('.vI')
            .each((i, val) => {
              const text = $(val).text();
              if (
                text.startsWith(attachmentNamePrefix) &&
                text.endsWith(attachmentNameExtension)
              ) {
                let html = composeView.getHTMLContent();
                html =
                  html +
                  `
                <br />
                ${getVoxBoxSignature()}
                `;
                composeView.setBodyHTML(html);
              }
            });
        } catch (err) {}
      });

      composeView.on('discard', () => {
        //todo: send message and kill stream
      });

      composeView.on('destroy', () => {
        //todo: send message and kill stream
      });
    });
  });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
