import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchDishes, addDishToOrder } from '../../services/dishes/disheslist';
import { OrderContext } from '../../context/OrderContext';

import styles from './ItemList.module.css';

const ItemList = () => {
  const { updateOrderCount } = useContext(OrderContext);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchDishes();
        setDishes(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadDishes();
  }, []);

  const handleAddToOrder = async (dishId) => {
    try {
      await addDishToOrder(dishId);
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