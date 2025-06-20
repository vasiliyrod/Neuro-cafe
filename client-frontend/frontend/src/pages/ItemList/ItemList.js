import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { fetchDishes, addDishToOrder } from '@/services/dishes/disheslist';
import { OrderContext } from '@/context/OrderContext';
import { EditOrderContext } from '@/context/EditOrderContext';
import styles from '@/pages/ItemList/ItemList.module.css';
import { AiOutlineSliders } from "react-icons/ai";

const ItemList = () => {
  const { updateOrderCount } = useContext(OrderContext);
  const { orderItems, updateQuantity } = useContext(EditOrderContext);
  const [dishes, setDishes] = useState([]);
  const [types, setTypes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const typeRefs = useRef({});
  const userID = Cookies.get('UID');

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#778477';
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
        setTypes(uniqueTypes);

        const uniqueCuisines = [...new Set(data.map((dish) => dish.cuisine))];
        setCuisines(uniqueCuisines);

        if (uniqueTypes.length > 0) {
          setActiveType(uniqueTypes[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadDishes();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveType(entry.target.id);
          } else if (activeType === entry.target.id) {
            setActiveType(null);
          }
        });
      },
      { threshold: [0.1, 0.9], rootMargin: '-50px 0px -50% 0px' }
    );

    const currentTypeRefs = typeRefs.current;

    types.forEach((type) => {
      if (currentTypeRefs[type]) {
        observer.observe(currentTypeRefs[type]);
      }
    });

    return () => {
      types.forEach((type) => {
        if (currentTypeRefs[type]) {
          observer.unobserve(currentTypeRefs[type]);
        }
      });
    };
  }, [types, activeType]);

  const handleAddToOrder = async (dishId, e) => {
    const newQuantity = 1;
    e.stopPropagation();
    try {
      await addDishToOrder(dishId);
      await updateQuantity(dishId, newQuantity);
      updateOrderCount();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в заказ:', error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity, e) => {
    await updateQuantity(id, newQuantity);
    updateOrderCount();
  };

  const scrollToType = (type) => {
    const element = typeRefs.current[type];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCuisineToggle = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const results = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    if (selectedCuisines.length === 0) return true;
    return selectedCuisines.includes(dish.cuisine);
  });

  return (
    <div className={styles.container}>
      <div className={styles.typeHeader}>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={styles.filterButton}
        >
          <AiOutlineSliders />
        </button>
        <div className={styles.typeButtons}>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => scrollToType(type)}
              className={`${styles.typeButton} ${activeType === type ? styles.active : ''}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {showFilter && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterContent}>
            <h3>Выберите кухню:</h3>
            {cuisines.map((cuisine) => (
              <label key={cuisine} className={styles.filterLabel}>
                <input
                  type="checkbox"
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={() => handleCuisineToggle(cuisine)}
                  className={styles.customCheckbox}
                />
                <span className={styles.checkmark}></span>
                {cuisine.toLowerCase()}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className={styles.searchContainer}>
        <div className={styles.border}>
          <p className={styles.p_menu}>MENU</p>
        </div>
        <div className={styles.searchBorder}>
          <div className={styles.searchOverlay}>
            <input
              type="text"
              placeholder="Поиск блюда в меню..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((dish) => (
                  <div key={dish.id} className={styles.searchResultItem}>
                    <Link to={`/item/${dish.id}`} className={styles.link_search}>
                      <img src={dish.img_link} alt={dish.name} className={styles.dishImage_search} />
                      <h2>{dish.name}</h2>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.dishesContainer}>
        {types.map((type) => (
          <div key={type} id={type} ref={(el) => (typeRefs.current[type] = el)}>
            <h2 className={styles.typeTitle}>{type.toUpperCase()}</h2>
            <div className={styles.dishesGrid}>
              {filteredDishes
                .filter((dish) => dish.type === type)
                .map((dish) => {
                  const orderItem = orderItems.find((item) => item.id === dish.id);
                  const quantity = orderItem ? orderItem.quantity : 0;

                  return (
                    <div key={dish.id} className={styles.item}>
                      <Link to={`/item/${dish.id}`} className={styles.link}>
                        <img src={dish.img_link} alt={dish.name} className={styles.dishImage} />
                        <h2>{dish.name}</h2>
                        <p>{dish.main_ingredients}</p>
                        <p>{dish.weight}</p>
                      </Link>
                      <div className={styles.buttons}>
                        <Link to={`/item/${dish.id}`} className={styles.button}>
                          {dish.cost} р
                        </Link>

                        {quantity > 0 ? (
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
                        ) : (
                          <button
                            onClick={(e) => handleAddToOrder(dish.id, e)}
                            className={styles.addButton}
                            disabled={!userID}
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
        ))}
      </div>
    </div>
  );
};

export default ItemList;