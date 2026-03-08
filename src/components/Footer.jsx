import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider}>
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path d="M0 15 L15 0 L30 15 L45 0 L60 15" stroke="var(--accent-purple)" strokeWidth="1" opacity="0.5" />
          <circle cx="30" cy="15" r="3" fill="var(--accent-glow)" opacity="0.4" />
        </svg>
      </div>
      <p className={styles.text}>
        Antropologia do Ocultismo &mdash; Uma disciplina acadêmica
      </p>
      <p className={styles.sub}>
        &copy; {new Date().getFullYear()} &middot; Todos os direitos reservados
      </p>
    </footer>
  )
}
