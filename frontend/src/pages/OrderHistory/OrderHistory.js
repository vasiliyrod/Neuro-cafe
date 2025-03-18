import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "@/pages/OrderHistory/OrderHistory.module.css";
import { fetchOrderHistory } from "@/services/dishes/orderhistory";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#FDFAF0';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrderHistory();
        const reversedData = [...data].reverse();
        setOrders(reversedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    loadOrders();
  }, []);

  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.his}>История заказов</h1>
      <div className={styles.orderContainer}>
        {orders.length === 0 ? (
                  <p className={styles.noOrdersMessage}>...Пока нет заказов...</p>
                ) : (
                  orders.map((order) => (
                    <OrderItem
                      key={order.id}
                      order={order}
                      isActive={activeId === order.id}
                      onClick={() => handleToggle(order.id)}
                    />
                  ))
                )}
      </div>
    </div>
  );
};

const OrderItem = ({ order, isActive, onClick }) => {
  const getBackgroundClass = () => {
    if (isActive) {
      return styles.activeBackground;
    }
    if (order.status.toLowerCase() === "completed") {
      return styles.completedBackground;
    }
    return styles.defaultBackground;
  };

  const totalCost = order.dishes.reduce((sum, dish) => sum + (dish.dish.cost * dish.count), 0);

  const orderDate = new Date(order.date);
  orderDate.setHours(orderDate.getHours() + 3);

  const formattedDate = orderDate.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`${styles.order} ${getBackgroundClass()}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.orderHeader}>
        <span className={styles.orderDate}>{formattedDate}</span>
        <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
          {order.status}
        </span>
      </div>

      <div className={styles.orderToggle}>
        {isActive ? (
          <FontAwesomeIcon icon={faTimes} className={styles.faTimes} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} className={styles.faChevronDown} />
        )}
      </div>

      {isActive && (
        <div className={styles.orderDetails}>
          <h4>Блюда:</h4>
          <ul>
            {order.dishes.map((dish, index) => (
              <li key={index}>
                {dish.dish.name} - {dish.count} * {dish.dish.cost} руб - {dish.dish.cost * dish.count} руб.
              </li>
            ))}
          </ul>
          <p className={styles.totalCost}>Итого: {totalCost} руб.</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;