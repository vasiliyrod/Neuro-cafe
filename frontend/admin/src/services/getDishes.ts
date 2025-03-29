import IDish from "../components/interfaces/IDish";
import authToken from "../config/authToken";
import API_BASE_URL from "../config/config";

export const getDishes = {
  async getAllDishes(): Promise<IDish[]> {
    const response = await fetch(`${API_BASE_URL}/dishes`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

export default getDishes;