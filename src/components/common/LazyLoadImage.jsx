'use client';

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function LazyLoadImageProp({ imageSrc, className }) {
  return (
    <div>
      <LazyLoadImage
        alt='admin_image'
        className={`${
          className ? className : 'h-10 w-10 border-2 rounded-full'
        } object-cover`}
        src={imageSrc}
        effect='blur'
      />
    </div>
  );
}
