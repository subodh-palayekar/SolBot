'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { loginUser } from '@/service/auth.service';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await loginUser(username, password);
      if (response?.status === 200) {
        toast({
          title: 'Success',
          description: 'Logged in successfully!',
          variant: 'default',
        });
        setIsAuthenticated(false);
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.error || 'Failed to log in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="min-h-screen w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center flex-col justify-center gap-10">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>

        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4 flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className={`w-full bg-gray-900 dark:bg-gray-700 text-white ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="inline-block w-6 h-6 border-4 border-gray-200 border-t-gray-900 dark:border-t-gray-400 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
