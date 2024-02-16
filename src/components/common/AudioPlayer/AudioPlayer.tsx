'use client';

import { HiOutlinePause, HiOutlinePlay } from 'react-icons/hi2';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

interface AudioPlayerProps {
  audioPath: string;
  playing: boolean;
  onPlay: any;
  pauseHandler: any;
}

const AudioPlayer = ({
  audioPath,
  playing,
  onPlay,
  pauseHandler,
}: AudioPlayerProps) => {
  const audioRef = useRef(new Audio(audioPath));
  const [currentTime, setCurrentTime] = useState('00:00');

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) {
      const handler = () => {
        pauseHandler();
      };
      audioRef.current.addEventListener('ended', handler);
    }
  }, [audioRef.current]);

  window.setInterval(function () {
    setCurrentTime(
      moment()
        .startOf('day')
        .add(audioRef.current.currentTime, 'minutes')
        .format('HH:mm')
    );
    // setProgress((videoRef.current?.currentTime / videoTime) * 100);
  }, 1000);

  return (
    <div>
      {playing ? (
        <div className='flex'>
          <div className='flex text-[12px]'>
            <span>{currentTime}</span>/
            <span>
              {moment()
                .startOf('day')
                .add(audioRef.current?.duration, 'minutes')
                .format('HH:mm')}
            </span>
          </div>
          <HiOutlinePause
            onClick={() => pauseHandler()}
            className='w-[20px] ml-auto text-admin-secondary cursor-pointer'
          />
        </div>
      ) : (
        <div>
          <HiOutlinePlay
            onClick={() => onPlay()}
            className='w-[20px] ml-auto text-admin-secondary cursor-pointer'
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
