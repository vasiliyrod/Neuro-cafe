import { useRef, useState } from "react";
import IDish from "../interfaces/IDish";
import { postImg } from "../../services/PostImg";
import { createDish } from "../../services/createDish";

interface Props {
  onCancel: () => void;
}

const initialDishState: Omit<IDish, "id"> = {
  name: "",
  type: "",
  cuisine: "",
  weight: "",
  cost: 0,
  description: "",
  main_ingredients: "",
  all_ingredients: "",
  img_link: "",
};

const NewDishCard = ({ onCancel }: Props) => {
  const [editedItem, setEditedItem] =
    useState<Omit<IDish, "id">>(initialDishState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Добавлено состояние для превью
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleCreate = async () => {
    try {
      let imageUrl = editedItem.img_link;

      // Загрузка изображения если есть файл
      if (selectedFile) {
        const imageResponse = await postImg.uploadImage(selectedFile);
        imageUrl = imageResponse;
        console.log(imageUrl);
      }

      // Создание объекта с обновленной ссылкой на изображение
      const dishData = {
        ...editedItem,
        img_link: imageUrl,
      };

      // Отправка данных блюда

      const createdDishId = await createDish.postNewDish(dishData);
      console.log("Dish created with ID:", createdDishId);

      // Очистка превью
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Сброс состояния
      setEditedItem(initialDishState);
      setSelectedFile(null);
      setPreviewUrl(null);
      onCancel();
    } catch (error) {
      console.error("Error creating dish:", error);
      // Здесь можно добавить обработку ошибок (например, показать уведомление)
    }
  };

  const handleCancel = () => {
    // Очистка превью
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setEditedItem(initialDishState);
    setSelectedFile(null);
    setPreviewUrl(null);
    onCancel();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value,
    }));
  };

  return (
    <div className="container-fluid mb-4" style={{ padding: "5px" }}>
      <div className="card">
        <h1 style={{ padding: "5px" }}>Создание нового блюда</h1>
        <div className="row g-0">
          {/* Секция загрузки изображения */}
          <div className="col-md-4">
            <div className="p-3">
              <label htmlFor="file">Изображение товара:</label>
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                onChange={handleFileChange} // Исправленный обработчик
                accept="image/*" // Добавлено ограничение на тип файлов
              />
              {previewUrl && ( // Изменено условие отображения
                <img
                  src={previewUrl}
                  className="img-fluid rounded mt-2"
                  alt="Preview"
                  style={{
                    objectFit: "cover",
                    minHeight: "250px",
                    maxHeight: "300px",
                  }}
                />
              )}
            </div>
          </div>

          {/* Секция формы */}
          <div className="col-md-8">
            <div className="card-body h-100 d-flex flex-column">
              <div className="flex-grow-1">
                <div className="row g-3">
                  {/* Поля формы */}
                  <div className="col-12">
                    <label className="form-label">Название:</label>
                    <input
                      name="name"
                      value={editedItem.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Тип:</label>
                    <input
                      name="type"
                      value={editedItem.type}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Кухня:</label>
                    <input
                      name="cuisine"
                      value={editedItem.cuisine}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Вес:</label>
                    <input
                      name="weight"
                      value={editedItem.weight}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Стоимость (₽):</label>
                    <input
                      type="number"
                      name="cost"
                      value={editedItem.cost}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Описание:</label>
                    <textarea
                      name="description"
                      value={editedItem.description}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Основные ингредиенты:</label>
                    <textarea
                      name="main_ingredients"
                      value={editedItem.main_ingredients}
                      onChange={handleChange}
                      className="form-control"
                      rows={2}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Все ингредиенты:</label>
                    <textarea
                      name="all_ingredients"
                      value={editedItem.all_ingredients}
                      onChange={handleChange}
                      className="form-control"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки управления */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-lg btn-secondary"
                  onClick={handleCancel}
                >
                  Отменить
                </button>
                <button
                  className="btn btn-lg btn-success"
                  onClick={handleCreate}
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDishCard;
