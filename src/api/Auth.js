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

export async function fetchDrivers(page) {
  try {
    const response = await axios.get(`${API_URL}/driver?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers', error);
    throw error;
  }
}

export async function deleteDriver(id) {
  try {
    await axios.delete(`${API_URL}/driver/${id}`);
  } catch (error) {
    console.error('Error deleting driver', error);
    throw error;
  }
}

export async function addDriver(driver) {
  try {
    const response = await axios.post(`${API_URL}/driver`, driver);
    return response.data;
  } catch (error) {
    console.error('Error adding driver', error);
    throw error;
  }
}