import authToken from "../config/authToken";
import API_BASE_URL from "../config/config";

export const completeOrder = {
  async sendOrderId(orderId: string, userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/orders/complete`, {
      method: "POST",
      headers: {
        [import.meta.env.VITE_authHeader]: String(authToken()),
        [import.meta.env.VITE_userIDheader]: userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id:orderId })
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    return response.json();
  }
};