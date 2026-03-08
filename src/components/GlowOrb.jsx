import styles from './GlowOrb.module.css'

export default function GlowOrb({ isActive, position, size = 40, delay = 0, label, onClick }) {
  return (
    <button
      className={`${styles.orbWrapper} ${isActive ? styles.active : ''}`}
      style={{
        top: position.top,
        left: position.left,
        transitionDelay: `${delay}s`,
      }}
      onClick={onClick}
      type="button"
    >
      <div
        className={styles.orb}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      {label && isActive && (
        <span className={styles.label}>{label}</span>
      )}
    </button>
  )
}
