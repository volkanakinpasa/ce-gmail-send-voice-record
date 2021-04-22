import { ATTACHMENT_NAME_PREFIX, ATTACHMENT_NAME_EXTENSION } from './contants';

var recordedChunks = [];
var stream = null;
var mediaRecorder = null;
var rec;
var input; //MediaStreamAudioSourceNode we'll be recording
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record
const reset = async () => {
  // stop();
  recordedChunks = [];

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(function (stream) {
        resolve(stream);
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
      // if (mediaRecorder && mediaRecorder.state === 'recording')
      //   resolve({ error: { message: 'Recording is already working' } });

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then(function (stream) {
          audioContext = new AudioContext();

          /* use the stream */
          input = audioContext.createMediaStreamSource(stream);

          rec = new Recorder(input, { numChannels: 1 });

          //start the recording process
          rec.record();

          // var options = { mimeType: 'audio/wav' };
          // mediaRecorder = new MediaRecorder(stream, { options });
          // mediaRecorder.ondataavailable = handleDataAvailable;
          // mediaRecorder.start();
          resolve(rec);
        })
        .catch(function (e) {
          console.log('error occured while getting user media', e);
        });
    } catch {
      console.log('cannot start recording');
      reject();
    }
  });
};

const stop = async (recParam) => {
  console.log('stop...', { rec, recParam });

  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  return new Promise((resolve, reject) => {
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV((blob) => {
      resolve(blob);
    });
  });
  // if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();

  // if (stream) stream.getTracks().forEach((track) => track.stop());
};

const generateVoieFileName = () => {
  const dateIsoNAme = new Date().toISOString();
  return `${ATTACHMENT_NAME_PREFIX}${dateIsoNAme}${ATTACHMENT_NAME_EXTENSION}`;
};

const audioUtils = { getChunk, getStream, start, stop, generateVoieFileName };
export default audioUtils;
