import API_BASE_URL from "../config/config";

export const sendMessage = {
  async send(text: string, image: File): Promise<Response> {
    const formData = new FormData();
    //formData.append("text", text);
    formData.append("file", image);

    const response = await fetch(`${API_BASE_URL}/maillist?text=${text}`, {
      method: "POST",
      headers: {
        [import.meta.env.VITE_authHeader]: String(import.meta.env.VITE_accessToken),
        [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
      },
      body: formData,
    });

    return response;
  },
};