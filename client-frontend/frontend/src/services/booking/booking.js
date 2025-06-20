import config from '@/config/config';
import Cookies from 'js-cookie';

const API_BASE_URL = config.apiURL;
const userID = Cookies.get('UID');

export const fetchCurrentBooking = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking`, {
      method: 'GET',
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data && data.table_id ? data : null;
    }
    return null;
  } catch (error) {
    console.error('Ошибка при загрузке текущего бронирования:', error);
    throw error;
  }
};

export const cancelBooking = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking`, {
      method: 'DELETE',
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при отмене бронирования');
    }
    return true;
  } catch (error) {
    console.error('Ошибка отмены бронирования:', error);
    throw error;
  }
};

export const fetchAvailableTables = async (date, startTime, endTime) => {
  try {
    const requestData = {
      date,
      timeStart: `${startTime}:00.000Z`,
      timeEnd: `${endTime}:00.000Z`
    };

    const response = await fetch(`${API_BASE_URL}/booking/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении данных о столах');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

export const createBooking = async (tableId, date, startTime, endTime) => {
  try {
    const bookingRequest = {
      table_id: tableId,
      timeStart: `${startTime}:00.000Z`,
      timeEnd: `${endTime}:00.000Z`,
      date
    };

    const response = await fetch(`${API_BASE_URL}/booking`, {
      method: 'POST',
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingRequest)
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.status || 'Ошибка бронирования');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка бронирования:', error);
    throw error;
  }
};