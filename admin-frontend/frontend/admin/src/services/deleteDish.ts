import API_BASE_URL from "../config/config";
import authToken from "../config/authToken";

export const deleteDish = {
  async delete(dishId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
        method: "DELETE",
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting dish:", error);
      throw error;
    }
  }
};