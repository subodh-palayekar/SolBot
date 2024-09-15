'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { getMnemonic } from '@/service/cryptoAccount.service';
import { CopyIcon, EyeOff, Eye, Clipboard, Check } from 'lucide-react'; // Add EyeOff and Eye icons for show/hide
import { useEffect, useState } from 'react';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false); // State for visibility
  const [isCopied, setIsCopied] = useState(false); // State for copied status

  async function getSecret() {
    try {
      setLoading(true);
      const response = await getMnemonic();
      setSecret(response?.mnemonic);
      console.log(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed To Get Secret Phrase Please Refresh The Page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(secret.join(' '));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {}
  };

  const handleShowHide = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    getSecret();
  }, []);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] flex items-center flex-col justify-center gap-10">
        <div className="w-full max-w-xl rounded-2xl border border-primary/10 p-5 bg-[#fdfdff] dark:bg-black">
          <div className="text-center text-2xl font-semibold my-5 text-black dark:text-white">
            Your Secret Phrase
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
              {Array.from({ length: 12 })?.map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                {secret?.map((ele, index) => (
                  <p
                    key={index}
                    className={` bg-zinc-900  hover:bg-zinc-700   rounded-lg p-4 text-center text-white ${
                      isVisible ? '' : 'blur-sm'
                    }`}
                  >
                    {ele}
                  </p>
                ))}
              </div>
              <div className="flex justify-between items-center mt-5 gap-4">
                <button
                  onClick={handleShowHide}
                  className=" flex items-center hover:cursor-pointer justify-between gap-2 dark:text-white text-black font-medium py-2 px-4 rounded"
                >
                  {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}{' '}
                  {isVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={handleCopy}
                  className=" flex items-center hover:cursor-pointer justify-between gap-2 dark:text-white  text-black font-medium py-2 px-4 rounded"
                >
                  {isCopied ? <Check size={18} /> : <Clipboard size={18} />}
                  {isCopied ? 'Copy' : 'Copied'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
