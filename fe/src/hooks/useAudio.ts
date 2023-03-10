import { useCallback, useEffect, useRef } from "react";

function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement>(new Audio(src));

  useEffect(() => {
    audioRef.current.load();
    audioRef.current.volume = 1;
  }, []);

  const play = useCallback(() => {
    audioRef.current.play();
  }, []);
  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  return { play, pause, audioRef: audioRef.current };
}

export default useAudio;
