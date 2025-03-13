import Button from "./components/Button";
import Alert from "./components/Alert";
import ListGroup from "./components/ListGroup";
import { useState } from "react";

function App() {
  const items = ["New York", "Lissabon", "Manchester", "Moscow"];

  const [showAlert, setShowAlert] = useState(false);

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const handleClickButton = () => {
    setShowAlert(!showAlert);
  };

  return (
    <div>
      <ListGroup
        items={items}
        heading="Cities list"
        onClickItem={handleSelectItem}
      ></ListGroup>
      {showAlert && (
        <Alert onClickEvent={handleClickButton}>
          <p>HELLO WORLD</p>
        </Alert>
      )}

      <Button style="secondary" onClickEvent={handleClickButton}>
        SomeText
      </Button>
    </div>
  );
}

export default App;
