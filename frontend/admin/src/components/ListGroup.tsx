import { MouseEvent, useState } from "react";

// Event Handler
//const handleClick = (event: MouseEvent) => console.log(event);

interface Props {
  items: string[];
  heading: string;
  onClickItem: (item: string) => void;
}

function ListGroup({ items, heading, onClickItem }: Props) {
  // State
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No item found!</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index), onClickItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
