import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  page: "Статистика" | "Меню" | "Рассылка" | "Заказы";
}

function NavigationBar({ page }: Props) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    height: "70px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  };

  const titleStyle: React.CSSProperties = {
    color: "#2D3748",
    fontSize: "1.4rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
    marginLeft: "1rem",
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    transition: "all 0.2s ease",
    borderRadius: "6px",
    margin: "0 4px",
    fontWeight: 500,
    borderWidth: "1px",
    padding: "8px 16px",
    ...(isActive && {
      boxShadow: "0 2px 6px rgba(0, 123, 255, 0.2)",
    }),
  });

  return (
    <div style={containerStyle} className="sticky-top">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div style={titleStyle}>
            Нейрокафе
            <span className="d-none d-md-inline"> | Администрирование</span>
          </div>

          <div className="d-flex flex-nowrap overflow-auto py-2">
            <Link to="/statistics" className="text-decoration-none">
              <Button
                variant={page === "Статистика" ? "primary" : "outline-dark"}
                style={buttonStyle(page === "Статистика")}
                className="btn-sm"
              >
                Статистика
              </Button>
            </Link>

            <Link to="/menu" className="text-decoration-none">
              <Button
                variant={page === "Меню" ? "primary" : "outline-dark"}
                style={buttonStyle(page === "Меню")}
                className="btn-sm"
              >
                Меню
              </Button>
            </Link>

            <Link to="/messaging" className="text-decoration-none">
              <Button
                variant={page === "Рассылка" ? "primary" : "outline-dark"}
                style={buttonStyle(page === "Рассылка")}
                className="btn-sm"
              >
                Рассылка
              </Button>
            </Link>

            <Link to="/orders" className="text-decoration-none">
              <Button
                variant={page === "Заказы" ? "primary" : "outline-dark"}
                style={buttonStyle(page === "Заказы")}
                className="btn-sm"
              >
                Заказы
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
