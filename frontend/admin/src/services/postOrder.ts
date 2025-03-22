import API_BASE_URL from "../config/config";

export const postOrder = {
  async sendOrderId(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: "POST",
      headers: {
        [import.meta.env.VITE_authHeader]: String(import.meta.env.VITE_accessToken),
        [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    return response.json();
  }
};