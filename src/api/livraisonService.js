import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export async function addLivraison(livraison) {
    try {
        const response = await axios.post(`${API_URL}/livraison`, livraison);
        return response.data;
    } catch (error) {
        console.error('Error adding livraison', error);
        throw error;
    }
}

export async function fetchLivraisons(page) {
    try {
        const response = await axios.get(`${API_URL}/livraison?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraisons', error);
        throw error;
    }
}

export async function searchLivraisons(searchTerm) {
    try {
        const response = await axios.get(`${API_URL}/livraison/search/${searchTerm}`);
        return response.data;
    } catch (error) {
        console.error('Error searching livraisons', error);
        throw error;
    }
}

export async function fetchbyCommande(NumeroCommande) {
    try {
        const response = await axios.get(`${API_URL}/livraison/${NumeroCommande}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraison by commande', error);
        throw error;
    }
}

export async function modifyLivraison(livraison) {
    try {
        const response = await axios.patch(`${API_URL}/livraison/${livraison.id}`, livraison);
        return response.data;
    } catch (error) {
        console.error('Error modifying livraison', error);
        throw error;
    }
}

export async function deleteLivraison(id) {
    try {
        const response = await axios.delete(`${API_URL}/livraison/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting livraison', error);
        throw error;
    }
}
