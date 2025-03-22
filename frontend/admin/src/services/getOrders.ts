import API_BASE_URL from "../config/config";
import IOrders from "../components/interfaces/IOrders"; // Убедитесь, что интерфейс IOrder существует

export const getOrders = {
  async getAllOrders(): Promise<IOrders[]> {
    const response = await fetch(`${API_BASE_URL}/orders/history/all`, {
      method: "GET",
      headers: {
        [import.meta.env.VITE_authHeader]: String(import.meta.env.VITE_accessToken),
        [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as IOrders[];
  }
};