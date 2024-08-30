'use client';

import Balance from '@/components/Balance';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { accountId } = useParams();
  return (
    <div className="w-full flex justify-center">
      <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center flex-col justify-center gap-10">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
        <div className="p-5 mt-7 flex flex-col">
          <Balance accountId={accountId as string} />
        </div>
      </div>
    </div>
  );
};

export default Page;
