import axios from 'axios';
import { useRouter } from 'next/router'; // Use this instead of 'next/navigation' for client-side navigation

const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const router = useRouter(); // Use useRouter for client-side navigation
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Function to create a crypto account
export async function createCryptoAccount(walletName: string) {
  try {
    const response = await axiosInstance.post(`/account`, {
      walletName, // Send walletName in the request body
    });
    return response;
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Failed to create account');
  }
}
// Function to get crypto account details
export async function getCryptoAccount() {
  try {
    const response = await axiosInstance.get(`/account`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error); // Updated error message
    throw new Error('Failed to get account');
  }
}

// Function to get crypto account with wallet details by accountId
export async function getCryptoAccountWithWalletDetails(accountId: string) {
  try {
    const response = await axiosInstance.get(`/account/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account with wallet details:', error); // Updated error message
    throw new Error('Failed to fetch account with wallet details');
  }
}

export async function checkAccontExist(accountName: string) {
  try {
    const response = await axiosInstance.get(`/account/exist/${accountName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account with wallet details:', error);
    throw new Error('Failed to fetch account with wallet details');
  }
}

export async function getMnemonic() {
  try {
    const response = await axiosInstance.get(`/secret`);
    return response.data;
  } catch (error) {
    console.error('Error fetching secret of user:', error);
    throw new Error('Failed to fetch secret of user');
  }
}
