import axios from 'axios';

export async function registerUser(username: string, password: string) {
  const response = await axios.post('/api/register', {
    username,
    password,
  });

  return response;
}
export async function loginUser(username: string, password: string) {
  const response = await axios.post('/api/login', {
    username,
    password,
  });

  return response;
}

export async function logout() {
  const response = await axios.get('/api/logout');

  return response;
}

export async function verifyUser() {
  try {
    const response = await axios.get('/api/verify');

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
