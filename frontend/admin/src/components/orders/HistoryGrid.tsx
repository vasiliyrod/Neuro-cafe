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
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

const emptyStateStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "40px",
  color: "#666",
  fontSize: "1.2em",
};

interface HistoryGridProps {
  orders: IOrders[];
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ orders }) => {
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  return (
    <div style={gridStyles}>
      {completedOrders.length === 0 ? (
        <div style={emptyStateStyles}>No completed orders found</div>
      ) : (
        completedOrders.map((order) => (
          <div key={order.id} style={orderCardStyles}>
            <h3>Order #{order.id}</h3>
            <p>Date: {new Date(order.date).toLocaleString()}</p>
            <p>
              Status: <strong>{order.status}</strong>
            </p>

            <div>
              {order.dishes.map(({ dish, count }) => (
                <div key={dish.id} style={dishItemStyles}>
                  <div style={{ fontWeight: "bold" }}>{dish.name}</div>
                  <div style={{ color: "#666", fontSize: "0.9em" }}>
                    x{count} • {dish.weight} • ${dish.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryGrid;
