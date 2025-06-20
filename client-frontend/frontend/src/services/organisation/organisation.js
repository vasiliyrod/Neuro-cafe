import config from '@/config/config';
import Cookies from 'js-cookie';

const API_BASE_URL = config.apiURL;

const userID = Cookies.get('UID');

export const getOrganisationInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cafe`,
    {
        method: 'GET',
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        }
    }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных организации');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};