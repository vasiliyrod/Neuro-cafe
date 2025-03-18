import config from '@/config/config';

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}/api/v1`;
const userID = Cookies.get('UID');

export const fetchImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cafe/interior`,
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
    console.error('Ошибка при загрузке данных интерьера:', error);
    throw error;
  }
};