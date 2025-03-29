import React, { useState } from "react";
import IOrders from "../interfaces/IOrders";

const gridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
};

const orderCardStyles: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  padding: "15px",
};

const dishItemStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

// Добавим стили для чекбокса
const checkboxStyles: React.CSSProperties = {
  marginLeft: "10px",
  position: "relative",
  display: "inline-block",
  width: "23px",
  height: "23px",
};

const getButtonStyles = (
  isCompleted: boolean,
  isHovered: boolean // Добавляем параметр для состояния наведения
): React.CSSProperties => ({
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: isCompleted
    ? "#4CAF50"
    : isHovered
    ? "#e0e0e0" // Цвет при наведении
    : "#f0f0f0", // Стандартный цвет
  color: isCompleted ? "white" : "#333",
  transition: "background-color 0.3s ease", // Добавляем плавный переход
});

interface OrdersGridProps {
  orders: IOrders[];
  onToggle: (orderId: string, clientId: string) => void;
}

const OrdersGrid: React.FC<OrdersGridProps> = ({ orders, onToggle }) => {
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null); // Состояние для отслеживания наведения
  const inProgressOrders = orders.filter(
    (order) => order.status === "in_progress"
  );

  return (
    <div style={gridStyles}>
      {inProgressOrders.length === 0 ? (
        <div>No orders in progress</div>
      ) : (
        inProgressOrders.map((order) => {
          const isOrderCompleted = order.status === "completed";

          return (
            <div key={order.id} style={orderCardStyles}>
              <h3>Столик {order.table_id}</h3>
              <div>
                <strong>{new Date(order.date).toLocaleString()}</strong>
              </div>
              <p>{order.status}</p>

              <div>
                {order.dishes.map(({ dish, count }) => (
                  <div key={dish.id} style={dishItemStyles}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{dish.name}</div>
                      <div style={{ color: "#666", fontSize: "0.9em" }}>
                        x{count}
                      </div>
                    </div>
                    {/* Добавлен чекбокс */}
                    <input
                      type="checkbox"
                      style={checkboxStyles}
                      // Можно добавить атрибуты, но логика не привязана
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <button
                  onClick={() => onToggle(order.id, order.user_id)}
                  style={getButtonStyles(
                    isOrderCompleted,
                    hoveredOrderId === order.id // Передаем состояние наведения
                  )}
                  onMouseEnter={() => setHoveredOrderId(order.id)} // Обработчик наведения
                  onMouseLeave={() => setHoveredOrderId(null)} // Обработчик ухода курсора
                >
                  {isOrderCompleted ? "Выполнено" : "Выполнить"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrdersGrid;
