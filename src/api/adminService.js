import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
