import { ReactNode, useState } from "react";

interface Props {
  style: string;
  onClickEvent: () => void;
  children: ReactNode;
}

const Button = ({ children, style, onClickEvent }: Props) => {
  return (
    <button className={style} onClick={onClickEvent}>
      {children}
    </button>
  );
};

export default Button;
