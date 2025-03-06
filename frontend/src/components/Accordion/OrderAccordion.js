import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderAccordion = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для получения данных о заказе
  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8000/history_orders"); // Замените на ваш URL
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">История заказов</h1>
      {order && (
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Заказ от {new Date(order.created_at).toLocaleString()}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <p>
                  <strong>Статус:</strong>{" "}
                  {order.status ? "Готов" : "В работе"}
                </p>
                <h5>Блюда:</h5>
                <ul>
                  {order.dishes.map((dish) => (
                    <li key={dish.id}>
                      <strong>{dish.name}</strong> (Количество:{" "}
                      {order.order_items[dish.id]})
                      <p>{dish.desc}</p>
                      <p>
                        <strong>Цена:</strong> {dish.cost} руб.
                      </p>
                      <p>
                        <strong>Вес:</strong> {dish.weight} г
                      </p>
                      <img
                        src={dish.img_link}
                        alt={dish.name}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )}
    </div>
  );
};

export default OrderAccordion;