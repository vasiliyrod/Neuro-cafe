import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';

export const fetchDishDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};