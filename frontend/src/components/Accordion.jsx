import styles from './Accordion.module.css';

export default function Accordion({ title, open, onToggle, children }) {
  return (
    <div className={styles.accordion}>
      <div className={styles.accordionHeader} onClick={onToggle}>
        {title}
        <span style={{ fontSize: '0.75rem' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
}
