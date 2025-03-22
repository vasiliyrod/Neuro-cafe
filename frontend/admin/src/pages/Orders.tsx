import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import ChooseButtons from "../components/orders/ChooseButtons";
import DishGrid from "../components/orders/OrdersGrid";
import HistoryGrid from "../components/orders/HistoryGrid";
import IOrders from "../components/interfaces/IOrders";
import { getOrders } from "../services/getOrders";

function Statistics() {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<"current" | "history">("current");

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getOrders.getAllOrders();
        setOrders(data);
      } catch (err) {
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

  const handleToggle = (orderId: string) => {
    // Обновляем локальное состояние
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
  };

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

export default Statistics;
