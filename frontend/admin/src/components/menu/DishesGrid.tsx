import IDish from "../interfaces/IDish";

//const handleClick = (event: MouseEvent) => console.log(event);

interface Props {
  items: IDish[];
  type: string;
  onClickItem: (item: IDish) => void;
}

const ProductsGrid = ({ items, type, onClickItem }: Props) => {
  const dishesOfType = items.filter((item) => item.type === type);

  return (
    <div className="container my-5">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {dishesOfType.map((item) => (
          <div key={item.id} className="col">
            <div className="card h-100">
              <img
                src={item.img_link}
                className="card-img-top img-fluid"
                alt={item.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h4 mb-0">{item.cost}₽</span>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onClickItem(item);
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
