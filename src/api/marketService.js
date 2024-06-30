import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function fetchMagasins(page) {
  try {
    const response = await axiosInstance.get(`/market?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching magasins', error);
    throw error;
  }
}

export async function deleteMagasin(id) {
  try {
    await axiosInstance.delete(`/market/${id}`);
  } catch (error) {
    console.error('Error deleting magasin', error);
    throw error;
  }
}

export async function addMagasin(magasin) {
  try {
    const response = await axiosInstance.post(`/market`, magasin);
    return response.data;
  } catch (error) {
    console.error('Error adding magasin', error);
    throw error;
  }
}

export async function modifyMagasin(magasin) {
  try {
    const response = await axiosInstance.patch(`/market/${magasin._id}`, magasin);
    return response.data;
  } catch (error) {
    console.error('Error modifying magasin', error);
    throw error;
  }
}

export async function searchMagasins(searchTerm) {
  try {
    const response = await axiosInstance.get(`/market/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching magasins', error);
    throw error;
  }
}
