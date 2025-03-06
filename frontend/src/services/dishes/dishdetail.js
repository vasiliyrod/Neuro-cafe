import axios from 'axios';
import config from '../../config/config';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const fetchDishDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes/${id}`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: "123",
          'Content-Type': 'application/json'
        }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};