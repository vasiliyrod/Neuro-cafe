import { useEffect, useRef, useState } from "react";
import DishesGrid from "../components/menu/DishesGrid";
import IDish from "../components/interfaces/IDish";
import NavigationBar from "../components/NavigationBar";
import DishCard from "../components/menu/DishCard";
import CategoryManager from "../components/menu/CategoryManager";
import AddDishButton from "../components/menu/AddDishButton";
import getDishes from "../services/getDishes";
import NewDishCard from "../components/menu/NewDishCard";

function Menu() {
  const categories = ["Основные блюда", "Закуски", "Супы"];

  const targetRef = useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [dishes, setDishes] = useState<IDish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await getDishes.getAllDishes();
        setDishes(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    loadDishes();
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

  return (
    <>
      <div ref={targetRef}>
        <NavigationBar page="Меню" />
      </div>

      {isLoading && <div>Загрузка меню...</div>}
      {error && <div className="error-message">Ошибка: {error}</div>}

      {!addingDish && itemIsSelected && selectedItem && (
        <DishCard item={selectedItem} onUpdate={handleSelectItem} />
      )}
      {addingDish ? (
        <NewDishCard onCancel={handleCancelCreate} />
      ) : (
        <AddDishButton onButtonClick={handleCreateDish} />
      )}

      <CategoryManager
        categories={categories}
        onAddCategory={handleChooseType}
      />

      <DishesGrid
        items={dishes}
        type={selectedType}
        onClickItem={handleSelectItem}
      />
    </>
  );
}

export default Menu;
