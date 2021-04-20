var recordedChunks = [];
var stream = null;
var mediaRecorder = null;

const reset = async () => {
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
  stream = await reset();
  // var options = { mimeType: 'audio/webm;codecs=opus' };
  mediaRecorder = new MediaRecorder(stream, {});
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

const stop = () => {
  mediaRecorder.stop();
  stream.getTracks().forEach((track) => track.stop());
};

const audioUtils = { getChunk, getStream, start, stop };
export default audioUtils;
