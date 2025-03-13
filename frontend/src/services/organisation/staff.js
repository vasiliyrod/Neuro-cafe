import config from '@/config/config';

import axios from 'axios';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const fetchStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff`,
    {
        headers: {
            [config.authHeader]: config.accessToken,
            'Content-Type': 'application/json'
        }
    })
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных персонала:', error);
    throw error;
  }
};
