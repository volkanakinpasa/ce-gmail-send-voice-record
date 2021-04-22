import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './resources/jquery';
import './resources/inboxsdk';
import audioUtils from './utils/audioUtils';

import {
  ATTACHMENT_NAME_PREFIX,
  ATTACHMENT_NAME_EXTENSION,
} from './utils/contants';

const popupId = 'gmail-voxbox-popup';
const voxBoxSignatureClassName = 'voxbox_signature';
const getVoxBoxSignature = () => {
  return `<a class="${voxBoxSignatureClassName}" href="123" target="_blank">Email with voice</a><br/>
<a href="123" target="_blank">Download VoxBox extension</a>`;
};

const loadInboxSDK = () => {
  InboxSDK.load(2, 'sdk_AutoShowFields_7f106636c4').then((sdk) => {
    sdk.Compose.registerComposeViewHandler(async (composeView) => {
      const composeId = new Date().getTime();
      let popup = null;
      const element = composeView.getElement();
      let voxBoxButtonElement = null;

      const initRecordingReactApp = () => {
        render(<App composeId={composeId} />, popup, function () {});
      };

      const createDiv = () => {
        popup = window.document.createElement('div');
        popup.id = popupId;
        $(voxBoxButtonElement).append(popup);
        initRecordingReactApp();
      };

      composeView.addButton({
        title: 'Record Voice',
        iconClass: 'gmail-voxbox-button',
        iconUrl: chrome.runtime.getURL('resources/record.png'),
        onClick: function (event) {
          chrome.runtime.sendMessage({
            type: 'startRecording',
            data: { composeId },
          });
        },
      });

      voxBoxButtonElement = $(element).find('.aDh');
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

        blob.name = audioUtils.generateVoieFileName();
        composeView.attachFiles([blob]);
      };

      composeView.on('presending', (e) => {
        try {
          const listRecipients = Array.prototype.concat(
            composeView.getToRecipients(),
            composeView.getCcRecipients(),
            composeView.getBccRecipients()
          );
          if (listRecipients && listRecipients.length > 0)
            $(element)
              .find('.vI')
              .each((i, val) => {
                const text = $(val).text();
                if (
                  text.startsWith(ATTACHMENT_NAME_PREFIX) &&
                  text.endsWith(ATTACHMENT_NAME_EXTENSION)
                ) {
                  const bodyElement = composeView.getBodyElement();
                  const signature = $(bodyElement).find(
                    `.${voxBoxSignatureClassName}`
                  );
                  console.log(signature);
                  if (!signature) {
                    let html = composeView.getHTMLContent();

                    html =
                      html +
                      `
                    <br />
                    ${getVoxBoxSignature()}
                    `;
                    composeView.setBodyHTML(html);
                  }
                }
              });
        } catch (err) {
          console.log('cannot add signature of VoxBox', err);
        }

        chrome.runtime.sendMessage({
          type: 'killRecording',
          data: { composeId },
        });
      });

      composeView.on('discard', () => {
        chrome.runtime.sendMessage({
          type: 'killRecording',
          data: { composeView, composeId },
        });
      });

      composeView.on('destroy', () => {
        chrome.runtime.sendMessage({
          type: 'killRecording',
          data: { composeView, composeId },
        });
      });
    });
  });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
