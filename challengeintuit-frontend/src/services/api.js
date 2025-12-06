import axios from 'axios';

const API_URL = import.meta.env.VITE_CHALLENGE_BACKEND_URL;

if (!API_URL) {
    console.error("ERROR CRÍTICO: No se encontró la variable de entorno VITE_CHALLENGE_BACKEND_URL");
}

const api = axios.create({
    baseURL: API_URL,
});

export const getClientes = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error("Error en getClientes:", error);
        throw error; 
    }
};

export const buscarClientes = async (texto) => {
    try {
        const response = await api.get(`/Buscar?texto=${texto}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            console.error("Error en buscarClientes:", error);
        }
        throw error;
    }
};

export const deleteCliente = async (id) => {
    try {
        await api.delete(`/Delete/${id}`);
    } catch (error) {
        console.error(`Error eliminando cliente ${id}:`, error);
        throw error;
    }
};

export const createCliente = async (cliente) => {
    try {
        await api.post('/Insert', cliente);
    } catch (error) {
        console.error("Error creando cliente:", error);
        throw error;
    }
};

export const updateCliente = async (id, cliente) => {
    try {
        await api.put(`/Update/${id}`, cliente);
    } catch (error) {
        console.error(`Error actualizando cliente ${id}:`, error);
        throw error;
    }
};

export default api;