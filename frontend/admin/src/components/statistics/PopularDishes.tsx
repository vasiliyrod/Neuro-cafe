import IDish from "../interfaces/IDish";

interface Props {
  data: Array<{ dish: IDish; count: number }>;
}

const PopularDishes = ({ data }: Props) => {
  const topDishes = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px 0",
          color: "#2d3436",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        Топ-10 популярных блюд
      </h3>
      <div className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {topDishes.map((item, index) => (
            <div key={item.dish.id} className="col">
              <div className="card h-100">
                <img
                  src={item.dish.img_link}
                  className="card-img-top img-fluid"
                  alt={item.dish.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="badge rounded-pill"
                      style={{
                        fontSize: "1.25rem",
                        padding: "0.5em 0.75em",
                        backgroundColor:
                          index === 0
                            ? "#ffd700"
                            : index === 1
                            ? "#c0c0c0"
                            : index === 2
                            ? "#cd7f32"
                            : "#0d6efd",
                        color: index < 3 ? "#2d3436" : "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                      }}
                    >
                      #{index + 1}
                    </span>
                    <h5 className="card-title mb-0">{item.dish.name}</h5>
                  </div>
                </div>
                <div className="card-footer bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h4 mb-0">{item.dish.cost}₽</span>
                    <span className="text-muted">{item.count} заказов</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
