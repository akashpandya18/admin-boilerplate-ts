import React, { useState } from 'react';
import Image from 'next/image';

const HoverableGifIcon = ({ staticSrc, gifSrc, alt, classN }) => {
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
