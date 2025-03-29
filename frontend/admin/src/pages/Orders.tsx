import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import ChooseButtons from "../components/orders/ChooseButtons";
import DishGrid from "../components/orders/OrdersGrid";
import HistoryGrid from "../components/orders/HistoryGrid";
import IOrders from "../components/interfaces/IOrders";
import { getOrders } from "../services/getOrders";
import { completeOrder } from "../services/completeOrder";
import { useNavigate } from "react-router-dom";
import authToken from "../config/authToken";

function Orders() {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<"current" | "history">("current");
  const navigate = useNavigate();
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getOrders.getAllOrders();
        setOrders(data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/login");
          return; // Выходим, чтобы не обновлять состояние ошибки
        }
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [menuType]); // Загружаем заказы при изменении типа меню

  const filteredOrders = orders.filter((order) =>
    menuType === "current"
      ? order.status === "in_progress"
      : order.status === "completed"
  );

  const handleChooseButton = (choice: string) => {
    setMenuType(choice as "current" | "history");
  };

  const handleToggle = async (orderId: string, clientId: string) => {
    try {
      setIsLoading(true);
      await completeOrder.sendOrderId(orderId, clientId);

      // Обновляем состояние только после успешного запроса
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "completed" } : order
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      <NavigationBar page="Заказы" />
      <ChooseButtons onButtonSelect={handleChooseButton} />

      {isLoading && <div>Loading orders...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {!isLoading && !error && (
        <>
          {menuType === "current" && (
            <DishGrid orders={filteredOrders} onToggle={handleToggle} />
          )}
          {menuType === "history" && <HistoryGrid orders={filteredOrders} />}
        </>
      )}
    </>
  );
}

export default Orders;
