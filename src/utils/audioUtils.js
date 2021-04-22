import { ATTACHMENT_NAME_PREFIX, ATTACHMENT_NAME_EXTENSION } from './contants';

var recordedChunks = [];
var stream = null;
var mediaRecorder = null;

const reset = async () => {
  stop();
  recordedChunks = [];

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(function (e) {
        resolve(e);
      })
      .catch(function (e) {
        console.log('error occured while getting user media', e);
        reject();
      });
  });
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  } else {
    console.log('no event.data.size');
  }
};

const getChunk = () => {
  return recordedChunks;
};

const getStream = () => {
  return stream;
};

const start = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mediaRecorder && mediaRecorder.state === 'recording')
        resolve({ error: { message: 'Recording is already working' } });

      stream = await reset();
      // var options = { mimeType: 'audio/webm;codecs=opus' };
      mediaRecorder = new MediaRecorder(stream, {});
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      resolve();
    } catch {
      console.log('cannot start recording');
      reject();
    }
  });
};

const stop = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();

  if (stream) stream.getTracks().forEach((track) => track.stop());
};

const generateVoieFileName = () => {
  const dateIsoNAme = new Date().toISOString();
  return `${ATTACHMENT_NAME_PREFIX}${dateIsoNAme}${ATTACHMENT_NAME_EXTENSION}`;
};

const audioUtils = { getChunk, getStream, start, stop, generateVoieFileName };
export default audioUtils;
