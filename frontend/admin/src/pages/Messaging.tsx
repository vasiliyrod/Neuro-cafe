import { useEffect } from "react";
import MessageForm from "../components/messaging/MessageForm";
import NavigationBar from "../components/NavigationBar";
import authToken from "../config/authToken";
import { useNavigate } from "react-router-dom";

function Messaging() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Если токен отсутствует, показываем пустой контейнер до срабатывания редиректа
  if (!authToken()) {
    return null;
  }

  return (
    <>
      <NavigationBar page="Рассылка" />
      <div style={{ margin: "30px" }}>
        <MessageForm />
      </div>
    </>
  );
}

export default Messaging;
