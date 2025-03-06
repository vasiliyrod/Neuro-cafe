import axios from 'axios';
import config from '../../config/config';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`,
      {
        message
      },
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
    console.error('Ошибка при отправке сообщения:', error);
    throw error;
  }
};


export const getChatHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`,
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
    console.error('Ошибка при получении истории:', error);
    throw error;
  }
};