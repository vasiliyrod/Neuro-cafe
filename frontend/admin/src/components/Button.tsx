import { ReactNode } from "react";

interface Props {
  style: React.CSSProperties;
  onClickEvent: () => void;
  children: ReactNode;
}

const Button = ({ children, style, onClickEvent }: Props) => {
  return (
    <button style={style} onClick={onClickEvent}>
      {children}
    </button>
  );
};

export default Button;
