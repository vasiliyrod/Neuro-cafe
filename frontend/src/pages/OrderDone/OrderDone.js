import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '@/pages/OrderDone/OrderDone.module.css';

const OrderDone = () => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
     navigate('/history');
  };

  const handleOrderClick1 = () => {
     navigate('/review');
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
          <button
              className={styles.main}
              onClick={handleOrderClick}
            >
              История заказов
           </button>
          <h1 className={styles.title}>ВАШ ЗАКАЗ</h1>
          <h1 className={styles.title}>УСПЕШНО ОФОРМЛЕН!</h1>
          <img
              src='https://i.postimg.cc/C1WqMSFv/Group-13-1.png'
              alt="GREAT!"
              className={styles.image}
          />
        </div>
        <div className={styles.section1}>
          <h1 className={styles.title1}>Вы можете поделиться вашим мнением!!</h1>
          <button
              className={styles.main1}
              onClick={handleOrderClick1}
            >
              Оставить отзыв
          </button>
        </div>
    </div>
  );
};

export default OrderDone;