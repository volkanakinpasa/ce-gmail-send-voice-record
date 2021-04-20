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
  const refAudio = useRef(null);

  const startRecording = () => {
    //todo: add try, catch and hide, destroy all.
    setShowRecordContainer(true);
    audioUtils.start();
    if (!timer.isRunning()) {
      timer.start();
    } else {
      timer.reset();
    }
  };

  const destroy = () => {
    setShowRecordContainer(false);
    setShowPlayContainer(false);
    setStream(null);
    setBlobUrl(null);
    setTimeValues(null);
  };

  const cancelRecording = (e) => {
    timer.stop();
    audioUtils.stop();
    destroy();
  };

  const cancelAttaching = (e) => {
    destroy();
  };

  const finishRecording = (e) => {
    timer.pause();
    audioUtils.stop();
    const recordedTime = timer.getTimeValues();
    timer.stop();
    setTimeout(() => {
      const c = audioUtils.getChunk();
      // setChunk(c);
      const s = audioUtils.getStream();
      // console.log({ s });
      setStream(s);
      const b = new Blob(c);
      const bUrl = URL.createObjectURL(b);
      // setBlob(b);
      setBlobUrl(bUrl);

      // console.log({ bUrl, b });

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

  // timer.addEventListener('started', (t) => {
  //   // console.log({ started: 1, t: t.detail.timer.getTimeValues() });
  // });

  // timer.addEventListener('paused', (t) => {
  //   // console.log({ paused: 1, t: t.detail.timer.getTimeValues() });
  // });

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      if (
        message.type === 'startRecording' &&
        message.data.composeId === composeId
      ) {
        // setComposeView(message.data.composeView);
        startRecording();
      }
    });
    setShowRecordContainer(true);
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
              <audio
                ref={refAudio}
                controls
                preload='metadata'
                src={blobUrl}
              ></audio>

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
          )}
        </>
      )}
    </>
  );
};

export default App;
