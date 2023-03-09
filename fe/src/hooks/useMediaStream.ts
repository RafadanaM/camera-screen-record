import { useCallback, useEffect, useRef, useState } from "react";

function useMediaStream(type: "camera" | "screen" = "camera") {
  const liveFeedRef = useRef<HTMLVideoElement | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    if (stream.current) return null;

    // can add dynamic options
    try {
      if (type === "camera") {
        stream.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", aspectRatio: 4 / 3 },
          audio: {
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
          },
        });
      } else {
        stream.current = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
      }

      setIsPlaying(true);
      return stream.current;
    } catch (error) {
      return null;
    }
  }, [type]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  useEffect(() => {
    if (!liveFeedRef.current) return;
    liveFeedRef.current.srcObject = stream.current;
  }, [isPlaying]);

  return { isPlaying, play, stop, liveFeedRef, stream };
}

export default useMediaStream;
