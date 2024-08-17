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
export async function fetchAdminData() {
const token = localStorage.getItem('token');
try {
  const response = await axios.get(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}catch (error) {
  console.error('Error fetching admins', error);
  throw error;
}
}
export async function createAdmin(data){
  try {
    const response = await axios.post(`${API_URL}/admin`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }

}
