import authToken from "../config/authToken";
import API_BASE_URL from "../config/config";

export const postImg = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file); // Используйте ключ, который ожидает бэкенд

    const response = await fetch(`${API_BASE_URL}/upload_image`, { // Уточните endpoint для загрузки
      method: "POST",
      headers: {
        [import.meta.env.VITE_authHeader]: String(authToken()),
        [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }

    return await response.json(); 
  },
};