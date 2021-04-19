import React, { FC, useEffect, useState } from 'react';
import useTimer from 'easytimer-react-hook';
import { timerUtils } from './utils/index';

import './app.css';

const App = (props) => {
  const { composeId } = props;
  const [showRecordContainer, setShowRecordContainer] = useState(false);
  // const [showPlayContainer, setShowPlayContainer] = useState(false);
  const [timer, isTargetAchieved] = useTimer({
    /* Hook configuration */
  });

  const [composeView, setComposeView] = useState(null);

  const startRecording = () => {
    if (!timer.isRunning()) {
      timer.start();
      setShowRecordContainer(true);
    } else {
      timer.reset();
    }
  };

  const pauseRecording = (e) => {
    timer.pause();
  };
  const stopRecording = (e) => {
    timer.stop();
  };

  const cancelRecording = (e) => {
    stopRecording(e);
    setShowRecordContainer(false);
  };

  const finishRecording = (e) => {
    pauseRecording(e);
    const recordedTime = timer.getTimeValues();
    chrome.runtime.sendMessage({
      type: 'attachRecording',
      data: { recordedTime, composeView, composeId },
    });
    setShowRecordContainer(false);
  };

  timer.addEventListener('started', (t) => {
    console.log({ started: 1, t: t.detail.timer.getTimeValues() });
  });

  timer.addEventListener('paused', (t) => {
    console.log({ paused: 1, t: t.detail.timer.getTimeValues() });
  });

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      if (
        message.type === 'startRecording' &&
        message.data.composeId === composeId
      ) {
        setComposeView(message.data.composeView);
        startRecording();
      }
    });
  }, []);

  return (
    <>
      {showRecordContainer && (
        <div className='gmail-send-voice-record gv-flex'>
          <img
            src={chrome.runtime.getURL('resources/microphone.svg')}
            title='Recording'
            className='gv-icon'
          />
          <div>{timerUtils.timerToString(timer)}</div>

          {/* <button
            onClick={(e) => {
              startRecording(e);
            }}
            className='gv-btn gv-timer-btn'
          >
            start
          </button> */}

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
              title='Attach this'
              className='gv-icon'
            />
          </button>
        </div>
      )}
      {/* {!showRecordContainer && showPlayContainer && (
        <>
          <div className='gmail-send-voice-play gv-flex'>
            <div>
              <img
                src={chrome.runtime.getURL('resources/play.svg')}
                title='Play'
                className='gv-play-icon'
              />
              <img
                src={chrome.runtime.getURL('resources/pause.svg')}
                title='Playing'
                className='gv-pause-icon'
              />
            </div>
            <div>{`${timer.getTimeValues().minutes}:${
              timer.getTimeValues().seconds
            }`}</div>
            <div>
              <button
                onClick={(e) => {
                  deleteRecord(e);
                }}
              >
                <img
                  src={chrome.runtime.getURL('resources/delete.svg')}
                  title='Delete'
                  className='gv-delete-icon'
                />
              </button>

              <button
                onClick={(e) => {
                  attachRecording(e);
                }}
              >
                <img
                  src={chrome.runtime.getURL('resources/done.svg')}
                  title='Attach this'
                  className='gv-done-icon'
                />
              </button>
            </div>
          </div>
        </>
      )} */}
    </>
  );
};

export default App;
