import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem('token');
};

export async function fetchMagasins(page) {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/market?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching magasins', error);
    throw error;
  }
}

export async function deleteMagasin(id) {
  try {
    const token = getToken();
    await axios.delete(`${API_URL}/market/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting magasin', error);
    throw error;
  }
}

export async function addMagasin(magasin) {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/market`, magasin, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding magasin', error);
    throw error;
  }
}

export async function modifyMagasin(magasin) {
  try {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/market/${magasin._id}`, magasin, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error modifying magasin', error);
    throw error;
  }
}

export async function searchMagasins(searchTerm) {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/market/search/${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching magasins', error);
    throw error;
  }
}
