import { useState, FC } from "react";
import "../StyleСhooseButtons.css";

interface CategoryManagerProps {
  categories?: string[];
  onAddCategory: (newCategory: string) => void;
}

const CategoryManager: FC<CategoryManagerProps> = ({
  categories = [],
  onAddCategory,
}) => {
  const [choice, setChoice] = useState(categories[0]);

  return (
    <div className="buttons-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`left-aligned-button ${
            choice === category ? "active-button" : ""
          }`}
          onClick={() => {
            onAddCategory(category);
            setChoice(category);
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryManager;
