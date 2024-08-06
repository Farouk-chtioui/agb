import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem('token');

export const fetchMagasins = async (page) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/market?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Ensure this returns an object with { markets, total, totalPages }
};

export const addMagasin = async (magasin) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/market`, magasin, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteMagasin = async (id) => {
  const token = getToken();
  await axios.delete(`${API_URL}/market/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const modifyMagasin = async (id, updatedMarket) => {
  try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.patch(
          `${API_URL}/market/${id}`,
          updatedMarket,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error modifying market:', error);
      throw error;
  }
};

export const searchMagasins = async (searchTerm) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/market/search/${searchTerm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const decreaseMarketTotals = async (id, period) => {
  try {
      const response = await axios.patch(`${API_URL}/market/${id}/decrease/${period}`);
      return response.data;
  } catch (error) {
      console.error('Error decreasing market totals:', error);
      throw error;
  }
};