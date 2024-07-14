import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export async function getDemandes_de_Livraisons() {
  try {
    const response = await axios.get(`${API_URL}/demande-livraison`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function addDemande_de_Livraison(demande_de_livraison) {
    try {
        const response = await axios.post(`${API_URL}/demande-livraison`, demande_de_livraison);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
    }
export async function modifyDemande_de_Livraison(demande_de_livraisonId, demande_de_livraison) {
    try {
        const response = await axios.put(`${API_URL}/demande-livraison/${demande_de_livraisonId}`, demande_de_livraison);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function deleteDemande_de_Livraison(demande_de_livraisonId) {
    try {
        const response = await axios.delete(`${API_URL}/demande-livraison/${demande_de_livraisonId}`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function modifyStatus(){
    try {
        const response = await axios.put(`${API_URL}/demande-livraison/status`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}