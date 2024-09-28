

import styles from "./barnavigation.module.css";

interface BarNavigationProps {
  filters: string[];
  onFilterClick: (filter?: string) => void;
}

export function BarNvigation({ filters, onFilterClick }: BarNavigationProps) {
  return (
    <header className={styles.header}>
      <section className={styles.main}>
        {filters.map((val) => (
          <button onClick={() => onFilterClick(val)}>{val}</button>
        ))}
        <button onClick={() => onFilterClick()}>ALL</button>
      </section>
    </header>
  );
}