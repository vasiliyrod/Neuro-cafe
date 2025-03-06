import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    throw error;
  }
};