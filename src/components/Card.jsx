import { motion } from 'framer-motion'
import { GiPadlock } from 'react-icons/gi'
import CardIcon from '../utils/iconMap'
import styles from './Card.module.css'

export default function Card({
  variant = 'home',
  icone,
  numero,
  titulo,
  descricao,
  topicosCount,
  onClick,
  animationDelay = 0,
  locked = false,
  unlockDate,
}) {
  return (
    <motion.div
      className={`${styles.card} ${styles[variant]} ${locked ? styles.locked : ''}`}
      onClick={locked ? undefined : onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={!locked && onClick ? { y: -6, transition: { duration: 0.25 } } : {}}
      style={!locked && onClick ? { cursor: 'pointer' } : {}}
    >
      {icone && <CardIcon name={icone} className={styles.icone} size={32} />}
      {numero !== undefined && (
        <span className={styles.numero}>
          {String(numero).padStart(2, '0')}
        </span>
      )}
      <div className={locked ? styles.lockedContent : undefined}>
        <h3 className={styles.titulo}>{titulo}</h3>
        {!locked && <p className={styles.descricao}>{descricao}</p>}
      </div>
      {locked && (
        <div className={styles.lockBadge}>
          <GiPadlock size={14} />
          <span>Disponível em {unlockDate}</span>
        </div>
      )}
      {!locked && topicosCount !== undefined && (
        <span className={styles.topicos}>{topicosCount} tópicos</span>
      )}
    </motion.div>
  )
}
