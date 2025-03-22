import React, { useState } from "react";
import "../StyleСhooseButtons.css";

interface ChooseButtonsProps {
  onButtonSelect: (arg0: string) => void;
}

const ChooseButtons: React.FC<ChooseButtonsProps> = ({ onButtonSelect }) => {
  const [choice, setChoice] = useState<"current" | "history">("current");

  const button1Text = "Текущие заказы";
  const button2Text = "История заказов";

  const handleButtonClick = (selectedChoice: "current" | "history") => {
    setChoice(selectedChoice);
    onButtonSelect(selectedChoice);
  };

  return (
    <div className="buttons-container">
      <button
        className={`left-aligned-button ${
          choice === "current" ? "active-button" : ""
        }`}
        onClick={() => handleButtonClick("current")}
      >
        {button1Text}
      </button>

      <button
        className={`left-aligned-button ${
          choice === "history" ? "active-button" : ""
        }`}
        onClick={() => handleButtonClick("history")}
      >
        {button2Text}
      </button>
    </div>
  );
};

export default ChooseButtons;
