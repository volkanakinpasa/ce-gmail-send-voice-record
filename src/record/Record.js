import React, { useEffect, useState } from 'react';
import useTimer from 'easytimer-react-hook';

import { timerUtils } from '../utils/index';
import './recorder';
import './app.css';

const Record = (props) => {
  const [showRecordContainer, setShowRecordContainer] = useState(false);
  const [showPlayContainer, setShowPlayContainer] = useState(false);
  const [timer, isTargetAchieved] = useTimer({});
  const [blobUrl, setBlobUrl] = useState(null);
  const [timeValue, setTimeValues] = useState(null);
  const [rec, setRec] = useState(null);
  const [gumStream, setGumStream] = useState(null);
  const [composeId, setComposeId] = useState(null);

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  const startRecording = async () => {
    setShowRecordContainer(true);
    var constraints = { audio: true, video: false };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext;
        audioContext = new AudioContext();
        setGumStream(stream);
        const input = audioContext.createMediaStreamSource(stream);
        const recorder = new Recorder(input, { numChannels: 1 });
        recorder.record();
        setRec(recorder);
        timer.start();
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const destroy = () => {
    chrome.runtime.sendMessage({
      type: 'deleteRecording',
      data: { composeId },
    });

    setShowRecordContainer(false);
    setShowPlayContainer(false);
    setGumStream(null);
    setBlobUrl(null);
    setTimeValues(null);
  };

  const cancelRecording = () => {
    try {
      rec.stop();
      rec.clear();
      gumStream.getAudioTracks()[0].stop();
      setShowRecordContainer(false);
    } catch (error) {
      console.log('cancelRecording', error);
    }

    destroy();
  };

  const cancelAttaching = (e) => {
    destroy();
  };

  const finishRecording = async (e) => {
    timer.pause();
    rec.stop();
    timer.stop();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(createDownloadLink);
  };

  const createDownloadLink = (blob) => {
    URL = window.URL || window.webkitURL;
    var url = URL.createObjectURL(blob);
    setBlobUrl(url);
    setShowRecordContainer(false);
    setShowPlayContainer(true);
  };

  const attach = () => {
    chrome.runtime.sendMessage({
      type: 'attachRecording',
      data: { blobUrl, composeId },
    });
    destroy();
  };

  useEffect(() => {
    const cId = getParameterByName('composeId');
    setComposeId(cId);

    startRecording();

    chrome.runtime.onMessage.addListener(function (message) {
      switch (message.type) {
        case 'startRecording':
          startRecording();
          break;
      }
    });
  }, []);

  return (
    <>
      {showRecordContainer && (
        <div className='flex items-center justify-between'>
          <div className=''>
            <img
              src={chrome.runtime.getURL('128.png')}
              title='Recording'
              className='gv-icon animated-icon animated-icon-a'
            />
            <img
              src={chrome.runtime.getURL('128-1.png')}
              title='Recording'
              className='gv-icon animated-icon animated-icon-b'
            />
          </div>
          <div className='flex items-center justify-between h-full'>
            <div>{timerUtils.timerToString(timer)}</div>
          </div>
          <div className='flex items-center justify-between h-full'>
            <button
              onClick={(e) => {
                cancelRecording(e);
              }}
              className='gv-btn gv-timer-btn'
            >
              <img
                src={chrome.runtime.getURL('128-cancel.png')}
                title='Delete'
                className='gv-icon'
              />
            </button>

            <button
              onClick={(e) => {
                finishRecording(e);
              }}
              className='gv-btn gv-timer-btn'
            >
              <img
                src={chrome.runtime.getURL('128-check.png')}
                title='Done'
                className='gv-icon'
              />
            </button>
          </div>
        </div>
      )}
      {!showRecordContainer && showPlayContainer && (
        <>
          {gumStream && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center justify-between h-full'>
                <audio
                  controls
                  controlsList='nodownload'
                  preload='auto'
                  src={blobUrl}
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </div>
              <div className='flex items-center justify-between h-full'>
                <button
                  onClick={(e) => {
                    cancelAttaching(e);
                  }}
                  className='gv-btn gv-timer-btn'
                >
                  <img
                    src={chrome.runtime.getURL('128-cancel.png')}
                    title='Delete'
                    className='gv-icon'
                  />
                </button>

                <button
                  onClick={(e) => {
                    attach(e);
                  }}
                  className='gv-btn gv-timer-btn'
                >
                  <img
                    src={chrome.runtime.getURL('128-attach.png')}
                    title='Attach this'
                    className='gv-icon'
                  />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Record;
