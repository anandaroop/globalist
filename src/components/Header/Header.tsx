import { DarkModeToggle } from "../Controls/DarkModeToggle";
import styles from "./Header.module.css";

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export const Header = ({ isDarkMode, onDarkModeToggle }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1 className={styles.title}>Globalist</h1>
      </div>
      <div className={styles.nav}>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
        <a
          href="https://github.com/anandaroop"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          Github
        </a>
      </div>
    </header>
  );
};
