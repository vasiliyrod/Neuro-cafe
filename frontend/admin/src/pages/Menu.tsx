import { useEffect, useRef, useState } from "react";
import DishesGrid from "../components/menu/DishesGrid";
import IDish from "../components/interfaces/IDish";
import NavigationBar from "../components/NavigationBar";
import DishCard from "../components/menu/DishCard";
import CategoryManager from "../components/menu/CategoryManager";
import AddDishButton from "../components/menu/AddDishButton";
import getDishes from "../services/getDishes";
import NewDishCard from "../components/menu/NewDishCard";
import { getCategories } from "../services/getCategories";
import { useNavigate } from "react-router-dom";
import authToken from "../config/authToken";
import { deleteDish } from "../services/deleteDish";

function Menu() {
  const targetRef = useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [categories, setCategories] = useState<string[]>(["Основные блюда"]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await getDishes.getAllDishes();
        setDishes(data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/login");
          return; // Выходим, чтобы не обновлять состояние ошибки
        }
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    loadDishes();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories.getAllCategories();
        setCategories(data);
        setErrorCategories(null);
      } catch (err) {
        setErrorCategories(
          err instanceof Error ? err.message : "Неизвестная ошибка"
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleCreateDish = () => {
    setAddingDish(true);
    setItemIsSelected(false);
    scrollToElement();
  };

  const handleSelectItem = (item: IDish) => {
    setSelectedItem(item);
    setItemIsSelected(true);
    setAddingDish(false);
    scrollToElement();
  };

  const handleDeleteItem = (dishId: number) => {
    const deleteItem = async (id: number) => {
      try {
        await deleteDish.delete(id); // No need to capture response if not used
        // Update dishes by filtering out the deleted dish
        setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== id));
        setErrorCategories(null);
      } catch (err) {
        setErrorCategories(
          err instanceof Error ? err.message : "Неизвестная ошибка"
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };
    setSelectedItem(null);
    setItemIsSelected(false);
    setAddingDish(false);
    deleteItem(dishId);
  };

  const handleChooseType = (type: string) => {
    setSelectedType(type);
  };

  const handleCancelCreate = () => {
    setAddingDish(false);
  };

  const [itemIsSelected, setItemIsSelected] = useState(false);
  const [selectedType, setSelectedType] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<IDish | null>(null);
  const [addingDish, setAddingDish] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Если токен отсутствует, показываем пустой контейнер до срабатывания редиректа
  if (!authToken()) {
    return null;
  }

  return (
    <>
      <div ref={targetRef}>
        <NavigationBar page="Меню" />
      </div>
      <div style={{ margin: "8px" }} />
      {!addingDish && itemIsSelected && selectedItem && (
        <div className="dish-card-animation">
          <DishCard
            item={selectedItem}
            onUpdate={handleSelectItem}
            onDelete={handleDeleteItem}
          />
        </div>
      )}
      {addingDish ? (
        <NewDishCard onCancel={handleCancelCreate} />
      ) : (
        <AddDishButton onButtonClick={handleCreateDish} />
      )}
      {isLoadingCategories && <div>Загрузка категорий...</div>}
      {errorCategories && <div className="error-message">Ошибка: {error}</div>}
      <CategoryManager
        categories={categories}
        onAddCategory={handleChooseType}
      />
      {isLoading && <div>Загрузка меню...</div>}
      {error && <div className="error-message">Ошибка: {error}</div>}
      <DishesGrid
        items={dishes}
        type={selectedType}
        onClickItem={handleSelectItem}
      />
    </>
  );
}

export default Menu;
