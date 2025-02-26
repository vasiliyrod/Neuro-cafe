import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { EditOrderContext } from '../../context/EditOrderContext';
import styles from './OrderPage.module.css';
import { OrderContext } from '../../context/OrderContext';

const OrderPage = () => {
  const { orderItems, total, updateQuantity, removeFromOrder } = useContext(EditOrderContext);
  const { updateOrderCount } = useContext(OrderContext);
  const navigate = useNavigate();

  const handleUpdateQuantity = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
    updateOrderCount();
  };

  const handleRemoveFromOrder = (id) => {
    removeFromOrder(id);
    updateOrderCount();
  };

  const isOrderEmpty = orderItems.length === 0;

  useEffect(() => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.backgroundColor = 'white';
        }

        return () => {
            if (navbar) {
                navbar.style.backgroundColor = '';
            }
        };
  }, []);

  const handleOrderClick = () => {
    if (!isOrderEmpty) {
      navigate('/confirmation');
    }
  };

  return (
    <div className={styles.container}>
      <h1>ВАШ ЗАКАЗ</h1>

      {orderItems.map((item) => (
        <div key={item.id} className={styles.item}>
          <h2>{item.name}</h2>
          <p>{item.cost * item.quantity} р</p>
          <p>{item.weight} г</p>
          <div className={styles.quantityControl}>
            <button
              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              className={styles.button}
              disabled={item.quantity <= 0}
            >
              -1
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              className={styles.button}
            >
              +1
            </button>
          </div>
          <button
            onClick={() => handleRemoveFromOrder(item.id)}
            className={styles.removeButton}
          >
            Удалить
          </button>
          <Link to={`/item/${item.id}`} className={styles.button}>
            Узнать больше
          </Link>
        </div>
      ))}

      <div className={styles.total}>
        <h2>ИТОГО</h2>
        <p>{total} РУБ</p>
      </div>

      <button
          className={styles.orderButton}
          disabled={isOrderEmpty}
          onClick={handleOrderClick}
        >
          Оформить заказ
        </button>
    </div>
  );
};

export default OrderPage;