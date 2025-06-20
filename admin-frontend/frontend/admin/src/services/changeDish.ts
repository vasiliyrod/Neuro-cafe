import API_BASE_URL from "../config/config";
import IDish from "../components/interfaces/IDish";
import authToken from "../config/authToken";

export const changeDish = {
  async updateDish(dishId: number, dishData: Omit<IDish, 'id'>): Promise<IDish> {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
        method: "PATCH",
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dishData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedDish: IDish = await response.json();
      return updatedDish;
    } catch (error) {
      console.error("Error updating dish:", error);
      throw error;
    }
  }
};