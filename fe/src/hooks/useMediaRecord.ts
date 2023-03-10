/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";
import { RecordingStatus } from "../types";

const mimeType = 'video/webm; codecs="opus,vp8"';

function useMediaRecord(stream: MediaStream | null) {
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const record = useCallback(() => {
    if (!stream) return;

    setRecordingStatus("recording");
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    mediaRecorderRef.current.start(2000);
  }, [stream]);

  const stop = useCallback(() => {
    setRecordingStatus("idle");

    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
  }, []);

  const onDataAvailable = useCallback(
    (cb: ((this: MediaRecorder, ev: BlobEvent) => any) | null) => {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.ondataavailable = cb;
    },
    []
  );

  const onStop = useCallback(
    (cb: ((this: MediaRecorder, ev: Event) => any) | null) => {
      if (!mediaRecorderRef.current) return;
      mediaRecorderRef.current.onstop = cb;
    },
    []
  );

  return { record, onDataAvailable, stop, onStop, recordingStatus };
}

export default useMediaRecord;
