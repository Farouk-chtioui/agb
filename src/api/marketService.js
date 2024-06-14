import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchMagasins(page) {
  try {
    const response = await axios.get(`${API_URL}/market?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching magasins', error);
    throw error;
  }
}

export async function deleteMagasin(id) {
  try {
    await axios.delete(`${API_URL}/market/${id}`);
  } catch (error) {
    console.error('Error deleting magasin', error);
    throw error;
  }
}

export async function addMagasin(magasin) {
  try {
    const response = await axios.post(`${API_URL}/market`, magasin);
    return response.data;
  } catch (error) {
    console.error('Error adding magasin', error);
    throw error;
  }
}

export async function modifyMagasin(magasin) {
  try {
    const response = await axios.patch(`${API_URL}/market/${magasin._id}`, magasin);
    return response.data;
  } catch (error) {
    console.error('Error modifying magasin', error);
    throw error;
  }
}

export async function searchMagasins(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/market/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching magasins', error);
    throw error;
  }
}
