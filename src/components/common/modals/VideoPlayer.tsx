'use client';

import 'react-html5video/dist/styles.css';
import { DefaultPlayer as Video } from 'react-html5video';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { HiOutlineXCircle } from 'react-icons/hi2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPlayerProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

function VideoPlayer({ open, setOpen }: VideoPlayerProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-5xl'>
        <DialogHeader>
          <HiOutlineXCircle
            onClick={() => setOpen(false)}
            className='w-[30px] cursor-pointer'
          />
        </DialogHeader>
        <DialogTitle className='text-lg font-medium leading-6 text-gray-900'>
          Relax for sometime
        </DialogTitle>
        <AspectRatio ratio={16 / 9}>
          <Video
            autoPlay
            loop
            controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
            poster='http://sourceposter.jpg'
            onCanPlayThrough={() => {}}
          >
            <source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' />
          </Video>
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
}

export default VideoPlayer;
