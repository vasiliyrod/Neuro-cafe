import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { confirmOrder } from '@/services/dishes/order';
import { OrderContext } from '@/context/OrderContext';
import styles from '@/pages/OrderConfirmationPage/OrderConfirmationPage.module.css';

const OrderConfirmationPage = () => {
  const [showHeart, setShowHeart] = useState(false);
  const { updateOrderCount } = useContext(OrderContext);
  const navigate = useNavigate();

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
      await confirmOrder();
      updateOrderCount();
      navigate('/done');
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
        <h1 className={styles.question}>или</h1>
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