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
    <div className={styles.container1}>
      <div className={styles.container}>
        <h1 className={styles.title}>ВАШ ЗАКАЗ</h1>

        {orderItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.topSection}>
              <div className={styles.raw}>
                  <img src={item.img_link} alt="dish_photo" className={styles.image} />
                  <div className={styles.column}>
                    <p className={styles.cost}>{item.cost * item.quantity} р</p>
                    <span className={styles.quantity}>{item.quantity} шт.</span>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className={styles.button1}
                        disabled={item.quantity <= 0}
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className={styles.button1}
                      >
                        +1
                      </button>
                    </div>
                  </div>
                 </div>
            </div>

            <div className={styles.bottomSection}>
              <h2 className={styles.name}>{item.name}</h2>
              <div className={styles.buttonsRow}>
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
            </div>
          </div>
        ))}

        <div className={styles.total}>
          <h2 className={styles.title}>ИТОГО</h2>
          <p className={styles.amount}>{total} РУБ</p>
        </div>

        <button
          className={styles.orderButton}
          disabled={isOrderEmpty}
          onClick={handleOrderClick}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

export default OrderPage;