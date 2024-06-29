// src/api/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function loginUser(email, password, rememberMe) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password, rememberMe });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
