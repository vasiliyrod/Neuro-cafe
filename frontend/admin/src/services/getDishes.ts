import IDish from "../components/interfaces/IDish";
import API_BASE_URL from "../config/config";

export const getDishes = {
  async getAllDishes(): Promise<IDish[]> {
    const response = await fetch(`${API_BASE_URL}/dishes`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(import.meta.env.VITE_accessToken),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Дополнительные методы для работы с API
  async createDish(dishData: Omit<IDish, "id">): Promise<IDish> {
    const response = await fetch(`${API_BASE_URL}/dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dishData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при создании блюда");
    }

    return await response.json();
  },
};

export default getDishes;