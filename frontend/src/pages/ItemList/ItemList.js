import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ItemList.module.css';
import { OrderContext } from '../../context/OrderContext';

const ItemList = () => {
  const { updateOrderCount } = useContext(OrderContext);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/dishes')
      .then((response) => setDishes(response.data))
      .catch((error) => console.error('Ошибка при загрузке данных:', error));
  }, []);

  // Функция для добавления блюда в заказ
  const handleAddToOrder = async (dishId) => {
    try {
      await axios.post(`http://127.0.0.1:8001/order/add/${dishId}`);
      updateOrderCount();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в заказ:', error);
    }
  };


  return (
    <div className={styles.container}>
      <h1>Список товаров</h1>
      {dishes.map((dish) => (
        <div key={dish.id} className={styles.item}>
          <h2>{dish.name}</h2>
          <p>{dish.cost} р</p>
          <p>{dish.weight} г</p>
          <Link to={`/item/${dish.id}`} className={styles.button}>
            Узнать больше
          </Link>
          <button
            onClick={() => handleAddToOrder(dish.id)}
            className={styles.addButton}
          >
            Добавить в заказ
          </button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;