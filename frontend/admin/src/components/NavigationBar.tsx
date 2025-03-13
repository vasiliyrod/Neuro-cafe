import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  page: "Статистика" | "Меню" | "Рассылка";
}

function NavigationBar({ page }: Props) {
  //const [selectedPage, setSelectedPage] = useState(page);

  return (
    <div className="container-fluid text-center  bg-secondary">
      <div className="row ">
        <div className="col">Нейрокафе | Администрирование</div>
        <div className="col">
          <Link to="/statistics">
            <Button
              variant={page === "Статистика" ? "primary" : "outline-light"}
            >
              Статистика
            </Button>
          </Link>

          <Link to="/menu">
            <Button variant={page === "Меню" ? "primary" : "outline-light"}>
              Меню
            </Button>
          </Link>

          <Link to="/messaging">
            <Button variant={page === "Рассылка" ? "primary" : "outline-light"}>
              Рассылка
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
