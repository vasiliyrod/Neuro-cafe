import { useRef, useState } from "react";
import IDish from "../interfaces/IDish";
import { postImg } from "../../services/PostImg";
import { changeDish } from "../../services/changeDish";

interface Props {
  item: IDish;
  onUpdate?: (updatedDish: IDish) => void;
  onDelete?: (dishId: number) => void;
}

const DishCard = ({ item, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<IDish>({ ...item });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setEditedItem({ ...item });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let newImgLink = editedItem.img_link;

      if (selectedFile) {
        newImgLink = await postImg.uploadImage(selectedFile);
        console.log(newImgLink);
      }
      //console.log(uploadResponse);
      const { id, ...rest } = editedItem;
      const dishData = { ...rest, img_link: newImgLink };

      const updatedDish = await changeDish.updateDish(item.id, dishData);

      setEditedItem(updatedDish);
      if (onUpdate) onUpdate(updatedDish);

      setIsEditing(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Не удалось сохранить изменения");
    } finally {
      setIsLoading(false);
    }
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
    <div className="container-fluid mb-4">
      <div className="card">
        <div className="row g-0">
          {/* Изображение товара */}
          <div className="col-md-4">
            {isEditing ? (
              <div className="p-3">
                <label htmlFor="file">Изображение товара:</label>
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  onChange={handleFileChange} // Используем новый обработчик
                  accept="image/*"
                />
                {(previewUrl || editedItem.img_link) && (
                  <img
                    src={previewUrl || editedItem.img_link} // Показываем превью или текущее изображение
                    className="img-fluid rounded"
                    alt="Preview"
                    style={{
                      objectFit: "cover",
                      minHeight: "250px",
                      maxHeight: "300px",
                    }}
                  />
                )}
              </div>
            ) : (
              <img
                src={item.img_link}
                className="img-fluid rounded h-100"
                alt={item.name}
                style={{ objectFit: "cover", minHeight: "250px" }}
              />
            )}
          </div>

          {/* Контент карточки */}
          <div className="col-md-8">
            <div className="card-body h-100 d-flex flex-column">
              {isEditing ? (
                <>
                  <div className="flex-grow-1">
                    <div className="row g-3">
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
                        <label className="form-label">
                          Основные ингредиенты:
                        </label>
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

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-lg btn-danger"
                      onClick={() => onDelete && onDelete(editedItem.id)}
                    >
                      Удалить блюдо
                    </button>
                    <button
                      className="btn btn-lg btn-secondary"
                      onClick={handleCancel}
                    >
                      Отменить изменения
                    </button>
                    <button
                      className="btn btn-lg btn-success"
                      onClick={handleSave}
                    >
                      Принять изменения
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Режим просмотра (оригинальная карточка) */}
                  <h2 className="card-title mb-3">
                    {item.name}{" "}
                    <small className="text-muted">(ID: {item.id})</small>
                  </h2>
                  <div className="flex-grow-1">
                    <div className="row">
                      <div className="col-6">
                        <p className="mb-1">
                          <strong>Тип:</strong> {item.type}
                        </p>
                        <p className="mb-1">
                          <strong>Кухня:</strong> {item.cuisine}
                        </p>
                        <p className="mb-1">
                          <strong>Вес:</strong> {item.weight}
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="mb-1">
                          <strong>Стоимость:</strong> {item.cost}₽
                        </p>
                        <p className="mb-1">
                          <strong>Основные ингредиенты:</strong>
                        </p>
                        <div className="text-muted small">
                          {item.main_ingredients}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="card-text">
                        <strong>Описание:</strong> {item.description}
                      </p>
                    </div>

                    <div className="mt-2">
                      <p className="mb-1">
                        <strong>Все ингредиенты:</strong>
                      </p>
                      <div
                        className="text-muted small"
                        style={{ maxHeight: "80px", overflowY: "auto" }}
                      >
                        {item.all_ingredients}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-lg btn-primary"
                      onClick={handleEdit}
                    >
                      Изменить
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
