'use client';
import { useState, useEffect } from 'react';

interface TimerProps {
  setTimeUp: any;
}

export default function Timer({ setTimeUp }: TimerProps) {
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(true);

  useEffect(() => {
    let timerId: any;
    if (runTimer) {
      setCountDown(30);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setTimeUp(true);
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);

  const seconds = String(countDown % 60).padStart(2, '0');
  const minutes = String(Math.floor(countDown / 60)).padStart(2, '0');
  return (
    <div
      className={
        'first-letter:text-right mr-1 mt-1 text-sm text-admin-secondary flex'
      }
    >
      Time Remaining: {minutes}:{seconds}
    </div>
  );
}
