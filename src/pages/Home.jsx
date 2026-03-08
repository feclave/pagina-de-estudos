import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiSparkles } from 'react-icons/gi'
import homeData from '../data/home.json'
import HeroCardDisplay from '../components/HeroCardDisplay'
import WheelSelector from '../components/WheelSelector'
import ScrollReveal from '../components/ScrollReveal'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { hero, cards } = homeData
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-home.png)` }}
        />

        <div className={styles.heroContent}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {hero.titulo}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {hero.subtitulo}
          </motion.p>

          <motion.button
            className={styles.cta}
            onClick={() => navigate('/aulas')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {hero.cta}
          </motion.button>
        </div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className={styles.scrollLine} />
        </motion.div>
      </section>

      {/* Cards Section */}
      <section className={styles.cardsSection}>
        <ScrollReveal>
          <div className={styles.sectionDivider}>
            <svg width="120" height="2" viewBox="0 0 120 2">
              <line x1="0" y1="1" x2="120" y2="1" stroke="var(--accent-purple)" strokeWidth="1" opacity="0.4" />
            </svg>
            <GiSparkles className={styles.sectionSymbol} size={14} />
            <svg width="120" height="2" viewBox="0 0 120 2">
              <line x1="0" y1="1" x2="120" y2="1" stroke="var(--accent-purple)" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <HeroCardDisplay card={cards[selectedIndex]} />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <WheelSelector
            cards={cards}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </ScrollReveal>
      </section>
    </main>
  )
}
