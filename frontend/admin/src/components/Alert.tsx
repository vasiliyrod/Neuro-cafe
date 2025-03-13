import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClickEvent: () => void;
}

const Alert = ({ children, onClickEvent }: Props) => {
  return (
    <div
      className="alert alert-primary alert-dismissible fade show"
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClickEvent}
      ></button>
    </div>
  );
};

export default Alert;
