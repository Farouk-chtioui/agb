import axios from 'axios';

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, { email, password });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}