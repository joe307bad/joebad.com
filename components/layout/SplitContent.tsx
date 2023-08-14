import styles from "../../styles/page.module.scss";

export function SplitContent({ children }) {
  return <div className={`${styles.splitContent} flex`}>{children}</div>;
}
