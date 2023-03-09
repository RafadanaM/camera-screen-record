/* eslint-disable no-nested-ternary */
import styles from "./VideoRecord.module.css";
import { ReactComponent as Person } from "../../assets/user.svg";

interface IVideoRecord {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  counter: number;
  isCounting: boolean;
}

function VideoRecord({ videoRef, counter, isCounting }: IVideoRecord) {
  return (
    <div className={styles.liveFeedContainer}>
      <video ref={videoRef} className={styles.liveFeed} autoPlay muted />
      <div className={styles.overlay}>
        {isCounting ? (
          <span className={styles.count}>{counter}</span>
        ) : counter > 0 ? (
          <Person className={styles.icon} />
        ) : null}
      </div>
    </div>
  );
}

export default VideoRecord;
