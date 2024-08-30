'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CryptoAccountType } from '@/lib/database/model/cryptoAccount.model';
import {
  createCryptoAccount,
  getCryptoAccount,
} from '@/service/cryptoAccount.service';
import { CirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from './ui/skeleton';

export function Sidebar() {
  const [userCryptoAccount, setUserCryptoAccount] = useState<
    CryptoAccountType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const getUserCryptoAccount = async () => {
    try {
      setIsLoading(true);
      const accounts = await getCryptoAccount();
      setUserCryptoAccount(accounts.cryptoAccount);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to fetch account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async () => {
    setIsLoading(true);
    await createCryptoAccount();
    getUserCryptoAccount();
    setIsLoading(false);
  };

  return (
    <Sheet>
      {isAuthenticated && (
        <SheetTrigger asChild>
          <div
            onClick={getUserCryptoAccount}
            className="text-black dark:text-white cursor-pointer font-semibold text-lg hover:text-gray-700 dark:hover:text-gray-300"
          >
            Accounts
          </div>
        </SheetTrigger>
      )}

      <SheetContent side={'left'} className="w-[200px]">
        <SheetHeader className="pb-5">
          <SheetTitle>Accounts</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            userCryptoAccount.map((account: CryptoAccountType) => (
              <SheetClose asChild key={account._id}>
                <Button
                  onClick={() => router.push(`/${account._id}`)}
                  type="submit"
                >
                  {account.accountName}
                </Button>
              </SheetClose>
            ))
          )}
        </div>

        <Button
          variant={'secondary'}
          className="my-3 flex items-center gap-[5px]"
          type="submit"
          disabled={isLoading}
          onClick={handleAddAccount}
        >
          <CirclePlus className="w-4 h-4" />
          <span>Create Account</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
