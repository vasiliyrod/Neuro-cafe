import React, { useState, useContext, useEffect } from 'react';
import styles from './OrderConfirmationPage.module.css';
import { OrderContext } from '../../context/OrderContext';

const OrderConfirmationPage = () => {
  const [showHeart, setShowHeart] = useState(false);
  const { updateOrderCount } = useContext(OrderContext);

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

  const handleNoClick = () => {
    setShowHeart(true);

    setTimeout(() => {
      setShowHeart(false);
    }, 1000);
  };

  const handleYesClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/order/done', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'заказ заказан' }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных');
      }

      updateOrderCount();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке данных.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.question}>
        Вы уже оплатили<br />
        ВАШ ЗАКАЗ?
      </h1>

      <div className={styles.buttons}>
        <button className={styles.buttonYes} onClick={handleYesClick}>
          Да
        </button>
        <h1 className={styles.question}>
            или
        </h1>
        <button className={styles.buttonNo} onClick={handleNoClick}>
          Нет
        </button>
      </div>

      {showHeart && (
        <div className={styles.heartContainer}>
          <div className={styles.heart}>&#10084;</div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;