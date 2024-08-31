'use client';
import React from 'react';
import { ModeToggle } from './ui/themeToggleButton';
import { Separator } from './ui/separator';
import { Sidebar } from './Sidebar';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { logout } from '@/service/auth.service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-3 px-6 flex items-center justify-between border-b border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-3">
        <Link className="flex justify-center items-center gap-4" href={'/'}>
          {/* <span className="text-xl font-bold tracking-wide text-zinc-900 dark:text-gray-100">
            SB
          </span> */}
          <Image src="/assets/logo.png" width={40} height={40} alt="logo" />
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 rounded-full">
            v1
          </span>
        </Link>

        <Separator
          className="h-6 bg-gray-400 dark:bg-zinc-600"
          orientation="vertical"
        />
        <Sidebar />
      </div>

      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <LogOut className="cursor-pointer" size={20} onClick={handleLogout} />
        ) : (
          <UserPlus
            className="cursor-pointer"
            size={20}
            onClick={() => {
              setIsAuthenticated(false);
              router.push('/login');
            }}
          />
        )}

        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
