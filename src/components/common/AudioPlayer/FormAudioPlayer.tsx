'use client';

import { useEffect, useRef } from 'react';

interface FormAudioPlayerProps {
  audio: string;
  setMin: any;
  setSec: any;
  flag: boolean;
}

const FormAudioPlayer = ({
  audio,
  setMin,
  setSec,
  flag,
}: FormAudioPlayerProps) => {
  const audioEl = useRef<any>(null);

  const handleLoadedMetadata = () => {
    const video = audioEl.current;
    if (!video) return;
    let minutes: string | number = Math.floor(video.duration / 60);
    const extraSeconds = video.duration % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let sec: string | number = parseInt(extraSeconds.toString());
    sec = sec < 10 ? '0' + sec : sec;
    setMin(minutes);
    setSec(sec);
  };

  function changeSource(url: string) {
    const video: any = document.getElementById('audio');
    if (!video) return;

    video.src = url;
  }

  useEffect(() => {
    changeSource(audio);
  }, [audio]);

  return (
    <div className={flag ? 'mt-1' : 'mt-2'}>
      <audio
        id='audio'
        onLoadedMetadata={handleLoadedMetadata}
        ref={audioEl}
        controls
        className='h-[42px]'
        style={{ width: '-webkit-fill-available' }}
      >
        <source src={audio} type='audio/ogg' />
      </audio>
    </div>
  );
};

export default FormAudioPlayer;
