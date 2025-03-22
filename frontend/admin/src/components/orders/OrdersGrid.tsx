import React from "react";
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

const getButtonStyles = (isCompleted: boolean): React.CSSProperties => ({
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: isCompleted ? "#4CAF50" : "#f0f0f0",
  color: isCompleted ? "white" : "#333",
});

interface OrdersGridProps {
  orders: IOrders[];
  onToggle: (orderId: string) => void;
}

const OrdersGrid: React.FC<OrdersGridProps> = ({ orders, onToggle }) => {
  const inProgressOrders = orders.filter(
    (order) => order.status === "in_progress"
  );

  return (
    <div style={gridStyles}>
      {inProgressOrders.length === 0 ? (
        <div>No orders in progress</div>
      ) : (
        inProgressOrders.map((order) => {
          const isOrderCompleted = order.status === "completed"; // Определяем статус заказа

          return (
            <div key={order.id} style={orderCardStyles}>
              <h3>Order {new Date(order.date).toLocaleString()}</h3>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
              <p>Status: {order.status}</p>

              <div>
                {order.dishes.map(({ dish, count }) => (
                  <div key={dish.id} style={dishItemStyles}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{dish.name}</div>
                      <div style={{ color: "#666", fontSize: "0.9em" }}>
                        x{count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <button
                  onClick={() => onToggle(order.id)} // Прямой вызов onToggle
                  style={getButtonStyles(isOrderCompleted)}
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
