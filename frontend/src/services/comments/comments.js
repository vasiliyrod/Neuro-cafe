import axios from 'axios';
import Cookies from 'js-cookie';

import config from '@/config/config';

const userID = Cookies.get('UID');
const API_BASE_URL = config.apiURL;

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews`, feedbackData, {
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error);
    throw error;
  }
};

export const fetchReviews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`, {
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
    });

    console.log("REVIEW DATA", response.data);

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке отзывов:', error);
    throw error;
  }
};