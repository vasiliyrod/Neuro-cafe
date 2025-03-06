import config from '../../config/config';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;

export const getOrganisationInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/infocafe`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};