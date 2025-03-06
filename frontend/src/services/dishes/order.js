const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const fetchOrder = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/order`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Некорректный формат данных: ожидался массив');
    }
    return data.map((item) => ({
      id: item.dish.id,
      quantity: item.quantity,
      name: item.dish.name,
      cost: item.dish.cost,
      img_link: item.dish.img_link,
      weight: item.dish.weight,
    }));
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error);
    throw error;
  }
};


export const updateQuantity = async (id, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: Number(quantity) }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка сервера: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при обновлении количества:', error);
    throw error;
  }
};


export const removeFromOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/remove/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении блюда:', error);
    throw error;
  }
};


export const addToOrder = async (dish) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/add/${dish.id}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при добавлении блюда:', error);
    throw error;
  }
};


export const confirmOrder = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/done`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'заказ заказан' }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке данных');
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};