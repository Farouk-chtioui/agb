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
export async function modifyDriver(driver) {
  try {
    const response = await axios.patch(`${API_URL}/driver/${driver._id}`, driver);
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
export async function fetchProducts(page) {
  try {
    const response = await axios.get(`${API_URL}/product?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products', error);
    throw error;
  }
}
export async function deleteProduct(id) {
  try {
    await axios.delete(`${API_URL}/product/${id}`);
  } catch (error) {
    console.error('Error deleting product', error);
    throw error;
  }
}
export async function addProduct(product){
  try {
    const response = await axios.post(`${API_URL}/product`, product);
    return response.data;
  } catch (error) {
    console.error('Error adding product', error);
    throw error;
  }
 
}
export async function modifyProduct(product){
  try {
    const response = await axios.patch(`${API_URL}/product/${product._id}`, product);
    return response.data;
  } catch (error) {
    console.error('Error modifying product', error);
    throw error;
  }
}
export async function searchProducts(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/product/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products', error);
    throw error;
  }
}