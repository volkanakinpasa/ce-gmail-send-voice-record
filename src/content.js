import './jquery';
import './inboxsdk';
import './recorder';
import audioUtils from './utils/audioUtils';
import './content.css';
import {
  ATTACHMENT_NAME_PREFIX,
  ATTACHMENT_NAME_EXTENSION,
} from './utils/contants';

const extensionId = chrome.runtime.id;
const extensionUrl = `https://chrome.google.com/webstore/detail/VoxBox/${extensionId}`;
const voxBoxSignatureClassName = 'voxbox_signature';
const voxBoxWebSite = 'http://www.voxbox.ai/';
const voxBoxSignatureFirstRow = `<a href="${voxBoxWebSite}"><strong>VOXBOX</strong></a> - email with voice`;

const getVoxBoxSignature = () => {
  return `${voxBoxSignatureFirstRow}<br/><a href="${extensionUrl}" target="_blank">Download FREE chrome extension</a>`;
};

const loadInboxSDK = () => {
  InboxSDK.load(2, 'sdk_VBVBVB_d5a6243996').then((sdk) => {
    sdk.Compose.registerComposeViewHandler(async (composeView) => {
      const composeId = new Date().getTime();
      const popupId = 'gmail-voxbox-popup-' + composeId;
      let attachedAudioCount = 0;
      let popup = null;
      const element = composeView.getElement();
      let voxBoxButtonElement = null;

      const createDiv = () => {
        popup = window.document.createElement('div');
        popup.id = popupId;
        popup.setAttribute('class', 'gmail-send-voice-record');
        $(voxBoxButtonElement).append(popup);
      };

      const removeIframe = (cId) => {
        if (cId == composeId) $(`#${popup.id}`).html('');
      };

      const createIframe = () => {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('allow', 'microphone *');
        iframe.setAttribute('class', 'gmail-send-voice-record-iframe');
        iframe.setAttribute('frameborder', 'no');
        iframe.setAttribute('scrolling', 'no');
        iframe.src = chrome.extension.getURL(
          'record.html?composeId=' + composeId
        );

        $(popup).append(iframe);
      };

      composeView.addButton({
        title: 'Record Voice',
        iconClass: 'gmail-voxbox-button',
        iconUrl: chrome.runtime.getURL('128.png'),
        onClick: function (event) {
          createIframe();
        },
      });

      voxBoxButtonElement = $(element).find('.aDh');
      createDiv();
      chrome.runtime.onMessage.addListener(async function (message) {
        if (message.type === 'attachRecording') {
          await attachRecording(message.data);
          removeIframe(message.data.composeId);
        } else if (message.type === 'deleteRecording') {
          removeIframe(message.data.composeId);
        }
      });

      const attachRecording = async (data) => {
        const blobUrl = data.blobUrl;
        let blob = await fetch(blobUrl).then((r) => r.blob());

        blob.name = audioUtils.generateVoieFileName();
        if (data.composeId == composeId) {
          composeView.attachFiles([blob]);
          attachedAudioCount++;
        }
      };

      composeView.on('presending', (e) => {
        if (attachedAudioCount && attachedAudioCount > 0) {
          try {
            const listRecipients = Array.prototype.concat(
              composeView.getToRecipients(),
              composeView.getCcRecipients(),
              composeView.getBccRecipients()
            );
            if (listRecipients && listRecipients.length > 0) {
              $(element)
                .find('.vI')
                .each((i, val) => {
                  const text = $(val).text();
                  if (
                    text.startsWith(ATTACHMENT_NAME_PREFIX) &&
                    text.endsWith(ATTACHMENT_NAME_EXTENSION)
                  ) {
                    const bodyElement = composeView.getBodyElement();

                    if (
                      $(bodyElement).text().indexOf(voxBoxSignatureFirstRow) ==
                      -1
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
                  }
                });
            }
          } catch (err) {
            console.log('cannot add signature of VoxBox', err);
          }
        }

        removeIframe(composeId);
      });

      composeView.on('discard', () => {
        removeIframe(composeId);
      });

      composeView.on('destroy', () => {
        removeIframe(composeId);
      });
    });
  });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
