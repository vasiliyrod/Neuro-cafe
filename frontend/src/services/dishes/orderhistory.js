import axios from "axios";
import Cookies from 'js-cookie';

import config from '@/config/config';

const userID = Cookies.get('UID');
const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const fetchOrderHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order_history`,
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
    console.error("Ошибка при загрузке данных истории:", error);
    throw error;
  }
};