import React, { useState } from 'react';
import Image from 'next/image';

interface HoverableGifIconProps {
  staticSrc: string;
  gifSrc: string;
  alt: string;
  classN: string;
}

const HoverableGifIcon = ({
  staticSrc,
  gifSrc,
  alt,
  classN,
}: HoverableGifIconProps) => {
  const [src, setSrc] = useState(staticSrc);

  return (
    <div
      onMouseEnter={() => setSrc(gifSrc)}
      onMouseLeave={() => setSrc(staticSrc)}
    >
      <Image src={src} alt={alt} width={30} height={30} className={classN} />
    </div>
  );
};

export default HoverableGifIcon;
