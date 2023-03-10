import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import styles from "./App.module.css";
import VideoRecord from "./components/VideoRecord/VideoRecord";
import useMediaStream from "./hooks/useMediaStream";
import useMediaRecord from "./hooks/useMediaRecord";
import Button from "./components/Button/Button";
import useInterval from "./hooks/useInterval";
import spider from "./assets/mantap.jpg";
import music from "./assets/music.mp3";
import useTimeout from "./hooks/useTimeout";
import { blobToBase64 } from "./utils/utilts";
import useAudio from "./hooks/useAudio";

// const mimeType = 'video/webm; codecs="opus,vp8"';
function App() {
  const [counter, setCounter] = useState(5);
  const [intervalDelay, setIntervalDelay] = useState(0);
  const [timeoutDelay, setTimeoutDelay] = useState(0);
  const {
    liveFeedRef: liveCameraRef,
    play: playCamera,
    stream: cameraStream,
  } = useMediaStream("camera");
  const {
    play: playScreen,
    stream: screenStream,
    stop: stopScreen,
  } = useMediaStream("screen");
  const {
    onDataAvailable: onCameraDataAvailable,
    record: recordCamera,
    stop: stopRecordCamera,
    recordingStatus: cameraRecordingStatus,
  } = useMediaRecord(cameraStream.current);
  const {
    onDataAvailable: onScreenDataAvailable,
    record: recordScreen,
    stop: stopRecordScreen,
  } = useMediaRecord(screenStream.current);

  function startRecording() {
    setIntervalDelay(1000);
    setTimeoutDelay(20000);
    recordCamera();
    recordScreen();
    const cameraRecordId = nanoid();
    let cameraRecordCount = 0;
    onCameraDataAvailable(async (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      const base64Data = await blobToBase64(event.data);
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/videos/${cameraRecordId}`,
          {
            data: base64Data,
            chunkNumber: cameraRecordCount,
          }
        );
        cameraRecordCount += 1;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });

    const screenRecordId = nanoid();
    let screenRecordCount = 0;
    onScreenDataAvailable(async (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      const base64Data = await blobToBase64(event.data);
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/videos/${screenRecordId}`,
          {
            data: base64Data,
            chunkNumber: screenRecordCount,
          }
        );
        screenRecordCount += 1;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
  }

  useEffect(() => {
    playCamera();
  }, [playCamera]);

  useEffect(() => {
    playScreen();
  }, [playScreen]);

  const { play } = useAudio(music);

  useInterval(() => {
    setCounter((prevState) => {
      const nextCount = prevState - 1;
      if (nextCount <= 0) {
        play();
        setIntervalDelay(0);
      }

      return nextCount;
    });
  }, intervalDelay);

  useTimeout(() => {
    stopRecordCamera();
    stopRecordScreen();
    stopScreen();
  }, timeoutDelay);

  return (
    <>
      <div className={styles.container}>
        <VideoRecord
          videoRef={liveCameraRef}
          counter={counter}
          isCounting={intervalDelay > 0}
        />
        <span className={styles.instruction}>
          Please <b> ALLOW</b> Camera and Screen Permission
        </span>
        <span className={styles.instruction}>
          Please select <b> THIS SCREEN</b> to share
        </span>
        <span className={styles.instruction}>
          Please align yourself with the outline on the video preview and press
          <b> START</b> to continue
        </span>
        {cameraRecordingStatus === "idle" ? (
          <Button type="button" onClick={startRecording}>
            START
          </Button>
        ) : null}
      </div>

      <img
        alt="surprise"
        src={spider}
        className={`${styles.mantap} ${counter > 0 ? styles.hide : ""} `}
      />
    </>
  );
}

export default App;
