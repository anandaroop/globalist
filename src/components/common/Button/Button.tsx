import styles from "./Button.module.css";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button = ({
  onClick,
  children,
  variant = "primary",
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
    >
      {children}
    </button>
  );
};
