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
export async function fetchLivraisons(){
    try {
        const response=await axios.get(`${API_URL}/livraison`);
        return response.data
    }catch(error){
        console.error('Error fetching clients',error)
        throw error;
    }

}
export async function searchLivraisons(searchTerm){
    try{
        const response=await axios.get(`${API_URL}/liraison/search/${searchTerm}`);
        return response.data
    } catch (error) {
        console.error('Error searching clients', error);
        throw error;
    }
}
export async function fetchbyCommande(NumeroCommande){
    try{
        const response=await axios.get(`${API_URL}/livraison/${NumeroCommande}`);
        return response.data
    }catch(error){
        console.error('Error fetching clients',error)
        throw error;
    }
}