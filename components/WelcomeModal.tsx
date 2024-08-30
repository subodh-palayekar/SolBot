import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createCryptoAccount } from '@/service/cryptoAccount.service';

// Define the type for the props
interface WelcomeProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [walletName, setWalletName] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    setIsModalOpen(isModalOpen);
  }, [isModalOpen]);

  // Validation for wallet name
  useEffect(() => {
    setIsValid(walletName.trim().length >= 3);
  }, [walletName]);

  const handleCreateAccount = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await createCryptoAccount(walletName);
      if (response.status === 201) {
        const accountId = response?.data?._id;

        router.push(`/${accountId}`);
      } else {
        console.error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Wallet</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Input
              type="text"
              placeholder="Enter Wallet Name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="mb-4"
            />
            {isValid && (
              <Button onClick={handleCreateAccount} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Submit'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
