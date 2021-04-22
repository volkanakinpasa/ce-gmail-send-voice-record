import React, { useEffect, useState, useRef } from 'react';
import useTimer from 'easytimer-react-hook';
import { timerUtils, audioUtils } from './utils/index';

import './app.css';

const App = (props) => {
  const { composeId } = props;

  const [showRecordContainer, setShowRecordContainer] = useState(false);
  const [showPlayContainer, setShowPlayContainer] = useState(false);
  const [timer, isTargetAchieved] = useTimer({});
  const [stream, setStream] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [timeValue, setTimeValues] = useState(null);
  const [rec, setRec] = useState(null);
  // const refAudio = useRef(null);

  const killRecording = async () => {
    cancelRecording();
  };
  const startRecording = async () => {
    // todo: add try, catch and hide, destroy all.

    const recStart = await audioUtils.start();
    setRec(recStart);
    // if (starData && starData.error) {
    //   alert(starData.error.message);
    //   return;
    // }
    // setShowRecordContainer(true);
    // if (!timer.isRunning()) {
    //   timer.start();
    // } else {
    //   timer.reset();
    // }
  };

  const destroy = () => {
    setShowRecordContainer(false);
    setShowPlayContainer(false);
    setStream(null);
    setBlobUrl(null);
    setTimeValues(null);
  };

  const cancelRecording = () => {
    audioUtils.stop();
    timer.stop();
    destroy();
  };

  const cancelAttaching = (e) => {
    destroy();
  };

  const finishRecording = async (e) => {
    timer.pause();
    const blob = await audioUtils.stop(rec);
    console.log('finishRecording', blob);
    // setBlob(blob)

    const recordedTime = timer.getTimeValues();
    timer.stop();
    setTimeout(() => {
      const c = audioUtils.getChunk();

      const s = audioUtils.getStream();

      setStream(s);
      const b = new Blob(c, { type: 'audio/mpeg' });
      const bUrl = URL.createObjectURL(b);

      setBlobUrl(bUrl);

      setShowRecordContainer(false);
      setShowPlayContainer(true);
    }, 1000);
  };

  const attach = () => {
    chrome.runtime.sendMessage({
      type: 'attachRecording',
      data: { composeId, blobUrl },
    });
    destroy();
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      switch (message.type) {
        case 'startRecording':
          if (message.data.composeId === composeId) {
            startRecording();
          }
          break;

        case 'killRecording':
          if (message.data.composeId === composeId) {
            killRecording();
          }
          break;
      }
    });
  }, []);

  return (
    <>
      {showRecordContainer && (
        <div className='flex gmail-send-voice-record flex items-center justify-between'>
          <div className='flex items-center justify-between h-full'>
            <img
              src={chrome.runtime.getURL('resources/microphone.svg')}
              title='Recording'
              className='gv-icon'
            />
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
                src={chrome.runtime.getURL('resources/delete.svg')}
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
                src={chrome.runtime.getURL('resources/done.svg')}
                title='Done'
                className='gv-icon'
              />
            </button>
          </div>
        </div>
      )}
      {!showRecordContainer && showPlayContainer && (
        <>
          {stream && (
            <div className='gmail-send-voice-record flex items-center justify-between'>
              <div className='flex items-center justify-between h-full'>
                <audio controls preload='auto' src={blobUrl}>
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
                    src={chrome.runtime.getURL('resources/delete.svg')}
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
                    src={chrome.runtime.getURL('resources/done.svg')}
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

export default App;
