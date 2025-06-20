import  API_BASE_URL from "../config/config";

export const getToken = {
  async getAdminToken(name: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: name, password: password })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.access_token;
  }
};