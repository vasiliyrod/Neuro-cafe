import axios from 'axios';
import Cookies from 'js-cookie';

import config from '@/config/config';

const userID = Cookies.get('UID');
const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const fetchDishDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes/${id}`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных о блюде:', error);
    throw error;
  }
};