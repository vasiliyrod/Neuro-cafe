import React from "react";

interface Props {
  onButtonClick: () => void;
}

const AddDishButton: React.FC<Props> = ({ onButtonClick }) => {
  const containerStyle: React.CSSProperties = {
    width: "100%",
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const buttonStyle: React.CSSProperties = {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 600,
    padding: "1rem 2rem",
    backgroundColor: "#6366f1",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    //fontFamily: "'Inter', sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const hoverStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#4f46e5",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const [currentStyle, setCurrentStyle] = React.useState(buttonStyle);

  return (
    <div style={containerStyle}>
      <button
        style={currentStyle}
        onClick={onButtonClick}
        onMouseEnter={() => setCurrentStyle(hoverStyle)}
        onMouseLeave={() => setCurrentStyle(buttonStyle)}
      >
        <span>+</span>
        <span>Добавить Блюдо</span>
      </button>
    </div>
  );
};

export default AddDishButton;
