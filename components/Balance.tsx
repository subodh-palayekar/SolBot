import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { getCryptoAccountWithWalletDetails } from '@/service/cryptoAccount.service';
import { CryptoAccountType } from '@/lib/database/model/cryptoAccount.model';
import { WalletType } from '@/lib/database/model/wallet.model';
import { SUPPORTED_COINS } from '@/lib/constant';
import { Check, Clipboard, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Meteors } from './ui/meteors';
import { BackgroundGradient } from './ui/background-gradient';

type BalanceParamsType = {
  accountId: string;
};

const Balance = ({ accountId }: BalanceParamsType) => {
  const [coin, setCoin] = useState<string>('Sol');
  const [accountDetails, setAccountDetails] = useState<WalletType>();
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] =
    useState<Boolean>(false);
  const [isPublicKeyCopied, setIsPublicKeyCopied] = useState(false);
  const [isPrivateKeyCopied, setIsPrivateKeyCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopy = (keyType: string) => {
    const key =
      keyType === 'public'
        ? accountDetails?.publicKey
        : accountDetails?.privateKey;
    navigator.clipboard.writeText(key || '');
    if (keyType === 'public') {
      setIsPublicKeyCopied(true);
      setTimeout(() => setIsPublicKeyCopied(false), 2000);
    } else {
      setIsPrivateKeyCopied(true);
      setTimeout(() => setIsPrivateKeyCopied(false), 2000);
    }
  };

  const togglePrivateKeyVisibility = () => {
    setIsPrivateKeyVisible(!isPrivateKeyVisible);
  };

  const getDetails = async () => {
    setIsLoading(true);
    const accountDetails: CryptoAccountType =
      await getCryptoAccountWithWalletDetails(accountId);
    const wallet = coin === 'Sol' ? 'solWallet' : 'ethWallet';
    const { privateKey, publicKey, balance } = accountDetails?.[wallet];
    setAccountDetails({ privateKey, publicKey, balance });
    setIsLoading(false);
  };

  useEffect(() => {
    getDetails();
  }, [coin]);

  return (
    <div className="flex  flex-col gap-5 max-w-lg w-full mx-auto px-4 md:px-0">
      {/* Coin Selector */}
      <BackgroundGradient className="p-1">
        <>
          <div className="flex justify-evenly p-2 bg-gray-100 dark:bg-gray-800 border border-primary/10 dark:border-gray-700 rounded-2xl items-center gap-2 sm:gap-4">
            {SUPPORTED_COINS.map((c: string) => (
              <span
                key={c}
                onClick={() => setCoin(c)}
                className={cn(
                  'p-2 flex-1 sm:flex-[0.5] grid place-items-center text-center font-semibold text-sm sm:text-lg rounded-2xl transition-colors duration-300 cursor-pointer',
                  coin === c
                    ? 'bg-white text-black dark:bg-black dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Balance Display */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <span className="font-bold text-[40px] sm:text-[60px] text-black dark:text-white">
              $
            </span>
            <span className="font-semibold text-[40px] sm:text-[60px] text-black dark:text-white">
              {parseFloat(accountDetails?.balance || '0').toFixed(2)}
            </span>
          </div>

          {/* Wallet Details */}
          <div className="flex flex-col  rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 px-4 sm:px-8 py-4">
              <span className="font-bold">Balance</span>
              <div className="flex w-full items-center justify-between">
                <span className="text-black dark:text-white">
                  {parseFloat(accountDetails?.balance || '0').toFixed(2)} {coin}
                </span>
                <span
                  className={cn(
                    'p-2 rounded-full',
                    coin === 'Sol' ? 'bg-white' : ''
                  )}
                >
                  {coin === 'Sol' ? (
                    <Image
                      src="/assets/sol.svg"
                      alt="Solana Logo"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/assets/ethereum.svg"
                      alt="Ethereum Logo"
                      width={17}
                      height={17}
                    />
                  )}
                </span>
              </div>
            </div>

            {/* Public and Private Key Display */}
            <div className="flex  flex-col gap-6 px-4 sm:px-8 py-4 rounded-2xl bg-secondary/50">
              <div className="flex flex-col gap-3">
                <span className="font-bold">Public Key</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <>
                      <span className="text-black dark:text-white break-all">
                        {accountDetails?.publicKey}
                      </span>
                      <span
                        onClick={() => handleCopy('public')}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-xl"
                      >
                        {isPublicKeyCopied ? (
                          <Check size={20} />
                        ) : (
                          <Clipboard size={20} />
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-bold">Private Key</span>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-black cursor-copy break-all dark:text-white">
                      {isPrivateKeyVisible
                        ? accountDetails?.privateKey
                        : '*'.repeat(accountDetails?.privateKey?.length || 60)}
                    </span>
                    <span
                      onClick={togglePrivateKeyVisibility}
                      className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-1 rounded-xl"
                    >
                      {isPrivateKeyVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </span>
                    <span
                      onClick={() => handleCopy('private')}
                      className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-1 rounded-xl"
                    >
                      {isPrivateKeyCopied ? (
                        <Check size={20} />
                      ) : (
                        <Clipboard size={20} />
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </BackgroundGradient>
    </div>
  );
};

export default Balance;
