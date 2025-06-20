const config = {
  apiHost: process.env.REACT_APP_API_HOST,
  apiPort: process.env.REACT_APP_API_PORT,

  apiMapKey: process.env.REACT_APP_YANDEX_MAP_API_KEY,

  accessToken: process.env.REACT_APP_CLIENT_TOKEN,
  authHeader: process.env.REACT_APP_AUTH_HEADER,
  userIDheader: process.env.REACT_APP_UID_HEADER,

  apiURL: process.env.REACT_APP_API_BASE_URL,
};

export default config;