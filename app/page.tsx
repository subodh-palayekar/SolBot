'use client';

import React, { useState } from 'react';
import Banner from '@/components/Banner';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CreateWallet } from '@/components/CreateWallet';
import Credits from '@/components/Credits';

const Page = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center justify-center">
      <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center flex-col justify-center gap-10">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Banner />

        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          onClick={handleClick}
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          <span>
            {isAuthenticated ? 'Create Wallet' : 'Get Started With SolBot'}
          </span>
        </HoverBorderGradient>
        <Credits />
      </div>

      <CreateWallet
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></CreateWallet>
    </div>
  );
};

export default Page;
