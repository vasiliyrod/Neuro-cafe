// createDish.ts

import API_BASE_URL from "../config/config";
import IDish from "../components/interfaces/IDish"; // Убедитесь, что путь до интерфейса правильный
import authToken from "../config/authToken";

export const createDish = {
  async postNewDish(dishData: Omit<IDish, 'id'>): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`, {
        method: "POST",
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dishData)
      });
        console.log(String(authToken))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdDishId: number = await response.json();
      return createdDishId;
    } catch (error) {
      console.error("Error creating dish:", error);
      throw error;
    }
  }
};