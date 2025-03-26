import Cookies from 'js-cookie';
import config from '@/config/config';

const API_BASE_URL = config.apiURL;
const userID = Cookies.get('UID');

export const recognizeSpeech = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.ogg');

  try {
    const response = await fetch(`${API_BASE_URL}/speech_to_text`, {
      method: 'POST',
      headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
        },
      body: formData,
    });
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при запросе к серверу');
    }

    const data = await response.json();
    return data.transcription || '';
  } catch (error) {
    console.error('Ошибка при распознавании речи:', error);
    return '';
  }
};