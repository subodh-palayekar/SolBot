import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <div className="min-w-full min-h-screen flex flex-col items-center justify-center">
      <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center flex-col justify-center gap-10">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Image
          src="/assets/logo.png"
          width={60}
          height={60}
          alt="Logo"
          className="fade-in-out"
        />
        <span className=" text-zinc-950 dark:text-white">Loading....</span>
      </div>
    </div>
  );
};

export default Loading;
