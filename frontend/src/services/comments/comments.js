import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error);
    throw error;
  }
};