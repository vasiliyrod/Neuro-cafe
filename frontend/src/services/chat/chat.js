import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    throw error;
  }
};