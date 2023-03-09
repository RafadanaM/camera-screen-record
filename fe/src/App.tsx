import { useEffect, useState } from "react";
import styles from "./App.module.css";
import VideoRecord from "./components/VideoRecord/VideoRecord";
import useMediaStream from "./hooks/useMediaStream";
import useMediaRecord from "./hooks/useMediaRecord";
import Button from "./components/Button/Button";
import useInterval from "./hooks/useInterval";
import spider from "./assets/mantap.jpg";
import useTimeout from "./hooks/useTimeout";

const mimeType = 'video/webm; codecs="opus,vp8"';
function App() {
  const [recordedVideo, setRecordedVideo] = useState("");
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [counter, setCounter] = useState(3);
  const [intervalDelay, setIntervalDelay] = useState(0);
  const [timeoutDelay, setTimeoutDelay] = useState(0);
  const {
    liveFeedRef: liveCameraRef,
    play: playCamera,
    stream: cameraStream,
  } = useMediaStream("camera");
  const { play: playScreen } = useMediaStream("screen");
  const { onDataAvailable, record, stop, onStop } = useMediaRecord(
    cameraStream.current
  );

  function startRecording() {
    const localChunks: Blob[] = [];
    setIntervalDelay(1000);
    setTimeoutDelay(5000);
    record();
    onDataAvailable((event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localChunks.push(event.data);
    });
    setVideoChunks(localChunks);
  }

  function stopRecording() {
    stop();
    onStop(() => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
    });
  }

  useEffect(() => {
    playCamera();
  }, [playCamera]);

  useEffect(() => {
    playScreen();
  }, [playScreen]);

  useInterval(() => {
    setCounter((prevState) => {
      const nextCount = prevState - 1;
      if (nextCount <= 0) {
        setIntervalDelay(0);
      }

      return nextCount;
    });
  }, intervalDelay);

  useTimeout(() => {
    stopRecording();
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
          Please align yourself with the outline on the video preview and press
          <b> START</b> to continue
        </span>

        <Button type="button" onClick={startRecording}>
          START
        </Button>
        <button type="button" onClick={stopRecording}>
          Stop
        </button>
        {recordedVideo.length > 0 && <video src={recordedVideo} controls />}
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
