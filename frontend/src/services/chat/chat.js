import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/config/config';

const API_BASE_URL = config.apiURL;
const userID = Cookies.get('UID');


export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`,
      {
        message
      },
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
    console.error('Ошибка при отправке сообщения:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat`,
      {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении истории сообщений:', error);
    throw error;
  }
};