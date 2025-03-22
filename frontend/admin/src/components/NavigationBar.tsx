import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  page: "Статистика" | "Меню" | "Рассылка" | "Заказы";
}

function NavigationBar({ page }: Props) {
  const containerStyle: React.CSSProperties = {
    width: "100vw",
    height: "7vh",
    backgroundColor: "#002F55",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle: React.CSSProperties = {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
    padding: "13px",
    //backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
    textAlign: "center",
  };

  return (
    <div className="container-fluid text-center  bg-secondary">
      <div className="row " style={containerStyle}>
        <div className="col">
          <div style={textStyle}>Нейрокафе | Администрирование</div>
        </div>
        <div className="col">
          <Link to="/statistics">
            <Button
              variant={page === "Статистика" ? "primary" : "outline-light"}
              style={{ margin: "5px" }}
            >
              Статистика
            </Button>
          </Link>

          <Link to="/menu">
            <Button
              variant={page === "Меню" ? "primary" : "outline-light"}
              style={{ margin: "5px" }}
            >
              Меню
            </Button>
          </Link>

          <Link to="/messaging">
            <Button
              variant={page === "Рассылка" ? "primary" : "outline-light"}
              style={{ margin: "5px" }}
            >
              Рассылка
            </Button>
          </Link>
          <Link to="/orders">
            <Button
              variant={page === "Заказы" ? "primary" : "outline-light"}
              style={{ margin: "5px" }}
            >
              Заказы
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
