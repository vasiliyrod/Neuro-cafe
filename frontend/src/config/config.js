const config = {
  apiHost: process.env.REACT_APP_API_HOST,
  apiPort: process.env.REACT_APP_API_PORT,
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJwYXNzd29yZCI6InhkVlZEd1h4Nkg0VU53ZG8iLCJleHAiOjYxNzQxMTE1NzA2fQ.OXFe6GbaAFJEBz36Joqbeyld70hEoCArPPmWVo3yxd4",
  authHeader: "X-Auth-Token",
  userIDheader: "X-UID",
  apiMap: process.env.REACT_APP_YANDEX_API_KEY
};

export default config;