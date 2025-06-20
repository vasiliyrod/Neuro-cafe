import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDishDetails } from '../../services/dishes/dishdetail';
import Navbar from '../../components/Nav/Navbar';
import styles from './ItemDetail.module.css';

const ItemDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);

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

  const ingredientsList = dish.main_ingredients
    .split(', ')
    .map((ingredient, index) => <li className={styles.desc1} key={index}>{ingredient}</li>);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.section}>
          <img
            src={dish.img_link}
            alt={dish.name}
            className={styles.image}
          />
          <div className={styles.overlay}>
            <div className={styles.dishInfo}>
              <h2 className={styles.dishName}>{dish.name}</h2>
              <p className={styles.dishPrice}>{dish.cost} р, <span className={styles.weight}>{dish.weight} г</span></p>
            </div>
            <div className={styles.cuisineSection}>
              <h2 className={styles.cuisine}># {dish.cuisine}</h2>
              <button className={styles.addButton}>Заказать</button>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.infoColumn}>
            <p className={styles.title}>Описание: </p>
            <p className={styles.desc}>{dish.desc}</p>
          </div>
          <div className={styles.infoColumn}>
            <p className={styles.title}>Ингредиенты: </p>
            <div className={styles.padding}>
              <ul className={styles.ingredientsList}>
                {ingredientsList}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.info1}>
          <p className={styles.title1}>Интересует что-то кроме: </p>
          <a href="/chat" className={styles.button}>
            Спросите у нашего помощника
          </a>

          <p className={styles.title2}>или </p>

          <a href="/menu" className={styles.button}>
            К меню
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;