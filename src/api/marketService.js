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
  return response.data;
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

export const modifyMagasin = async (magasin) => {
  const token = getToken();
  const response = await axios.patch(`${API_URL}/market/${magasin._id}`, magasin, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
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
