import { AnimatePresence, motion } from 'framer-motion'
import CardIcon from '../utils/iconMap'
import styles from './HeroCardDisplay.module.css'

export default function HeroCardDisplay({ card }) {
  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          className={styles.heroCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Top: text + image */}
          <div className={styles.topRow}>
            <div className={styles.textSide}>
              <div className={styles.iconRow}>
                <CardIcon name={card.icone} className={styles.icon} size={42} />
              </div>
              <h3 className={styles.cardTitle}>{card.titulo}</h3>
              {card.descricao.split('\n\n').map((paragrafo, i) => (
                <p key={i} className={styles.cardDesc}>{paragrafo}</p>
              ))}
              {card.cronograma && (
                <ul className={styles.cronograma}>
                  {card.cronograma.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {card.imagem && (
              <div className={styles.imageSide}>
                <div className={styles.imageWrapper}>
                  <img src={`${import.meta.env.BASE_URL}${card.imagem}`} alt={card.titulo} className={styles.cardImage} />
                  <div className={styles.imageOverlay} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom: bullets inside the card */}
          {card.bullets && card.bullets.length > 0 && (
            <div className={styles.bulletsRow}>
              {card.bullets.map((text, i) => (
                <div key={i} className={styles.bulletCard}>
                  <span className={styles.bulletNumber}>{i + 1}.</span>
                  <p className={styles.bulletText}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
