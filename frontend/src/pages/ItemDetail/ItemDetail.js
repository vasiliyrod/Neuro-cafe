import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchDishDetails } from '../../services/dishes/dishdetail';

import Navbar from '../../components/Nav/Navbar';
import styles from './ItemDetail.module.css';

const ItemDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    const loadDishDetails = async () => {
      try {
        const data = await fetchDishDetails(id);
        setDish(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadDishDetails();
  }, [id]);

  if (!dish) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <Navbar /> {styles.nav}
      <div className={styles.container}>
        <h1>Детали товара</h1>
        <h2>{dish.name}</h2>
        <p>Цена: {dish.cost} р</p>
        <p>Вес: {dish.weight} г</p>
        <p>Описание: {dish.desc}</p>
        <p>Тип: {dish.type}</p>
        <a href="/menu" className={styles.button}>
          К меню
        </a>
        <a href="/chat" className={styles.button}>
          К чату
        </a>
      </div>
    </div>
  );
};

export default ItemDetail;