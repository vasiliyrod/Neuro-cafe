import React, { useContext, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { fetchDishes, addDishToOrder } from '@/services/dishes/disheslist';
import { OrderContext } from '@/context/OrderContext';
import { EditOrderContext } from '@/context/EditOrderContext';
import styles from '@/pages/ItemList/ItemList.module.css';

const ItemList = () => {
  const { updateOrderCount } = useContext(OrderContext);
  const { orderItems, updateQuantity } = useContext(EditOrderContext);
  const [dishes, setDishes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#FDFAF0';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchDishes();
        setDishes(data);

        const uniqueTypes = [...new Set(data.map((dish) => dish.type))];
        setTypes(['all', ...uniqueTypes]);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadDishes();
  }, []);

  const filteredDishes = selectedType === 'all'
    ? dishes
    : dishes.filter((dish) => dish.type === selectedType);

  const handleAddToOrder = async (dishId, e) => {
    const newQuantity = 1;
    e.stopPropagation();
    try {
      await addDishToOrder(dishId);
      updateQuantity(dishId, newQuantity);
      updateOrderCount();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в заказ:', error);
    }
  };

  const handleUpdateQuantity = (id, newQuantity, e) => {
    updateQuantity(id, newQuantity);
    updateOrderCount();
  };

  return (
    <div className={styles.container}>

      <div
          className={styles.typeHeader}
        >
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`${styles.typeButton} ${selectedType === type ? styles.active : ''}`}
            >
              {type === 'all' ? 'Меню' : type}
            </button>
          ))}
        </div>

      <div className={styles.dishesContainer}>
        {filteredDishes.map((dish) => {
          const orderItem = orderItems.find((item) => item.id === dish.id);
          const quantity = orderItem ? orderItem.quantity : 0;

          return (
            <div key={dish.id} className={styles.item}>
              <Link to={`/item/${dish.id}`} className={styles.link}>
                <img src={dish.img_link} alt={dish.name} className={styles.dishImage} />
                <h2>{dish.name}</h2>
                <p>{dish.main_ingredients}</p>
                <p>{dish.weight} г</p>
              </Link>
              <div className={styles.buttons}>
                <Link to={`/item/${dish.id}`} className={styles.button}>
                    {dish.cost} р
                  </Link>

                {quantity > 0 ? (
                  <>
                    <div className={styles.section_quantity}>
                        <button
                          onClick={(e) => handleUpdateQuantity(dish.id, quantity - 1, e)}
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button
                          onClick={(e) => handleUpdateQuantity(dish.id, quantity + 1, e)}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={(e) => handleAddToOrder(dish.id, e)}
                    className={styles.addButton}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemList;