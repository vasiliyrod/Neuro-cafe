import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <h1>404 - Страница не найдена</h1>
      <Link to="/">
        <button>Go back home</button>
      </Link>
    </>
  );
}

export default NotFound;
