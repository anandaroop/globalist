import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1 className={styles.title}>Globalist</h1>
      </div>
      <div className={styles.nav}>
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
