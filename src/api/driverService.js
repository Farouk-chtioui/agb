import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token');

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
    await axios.delete(`${API_URL}/driver/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting driver', error);
    throw error;
  }
}

export async function addDriver(driver) {
  try {
    const response = await axios.post(`${API_URL}/driver`, driver, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding driver', error);
    throw error;
  }
}

export async function modifyDriver(driver) {
  try {
    const response = await axios.patch(`${API_URL}/driver/${driver._id}`, driver, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error modifying driver', error);
    throw error;
  }
}

export async function searchDrivers(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/driver/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching drivers', error);
    throw error;
  }
}
