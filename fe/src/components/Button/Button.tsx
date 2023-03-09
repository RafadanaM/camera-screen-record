/* eslint-disable react/button-has-type */
import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

function Button({
  className,
  children,
  type,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${styles.button}`} type={type ?? "button"} {...props}>
      {children}
    </button>
  );
}

export default Button;
