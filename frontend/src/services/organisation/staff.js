import config from '@/config/config';

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = config.apiURL;
const userID = Cookies.get('UID');

export const fetchStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cafe/staff`,
    {
        headers: {
            [config.authHeader]: config.accessToken,
            [config.userIDheader]: userID,
            'Content-Type': 'application/json'
        }
    })

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных персонала:', error);
    throw error;
  }
};
