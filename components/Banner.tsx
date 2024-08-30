import React from 'react';
import { Cover } from './ui/cover';

const Banner = () => {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Building Future Of <br />
      </h1>
      <span className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center  relative z-20 py-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        <Cover>Cryptocurrency</Cover>
      </span>
    </div>
  );
};

export default Banner;
