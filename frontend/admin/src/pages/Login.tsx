import React, { useEffect, useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import { getToken } from "../services/getToken";
import { useNavigate } from "react-router";
import authToken from "../config/authToken";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Если токен отсутствует, показываем пустой контейнер до срабатывания редиректа
  if (!authToken()) {
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await getToken.getAdminToken(username, password);
      localStorage.setItem("authToken", response); // Вот тут надо проверить чтобы всё правильно было
      navigate("/menu");
      console.log(response);
    } catch (err) {
      console.log(err);
      setError("Введены неверные учетные данные");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h2 className="text-center mb-4">Авторизация</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Войти
            </Button>
            <p>{error}</p>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
