import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import aulasData from '../data/aulas.json'
import { isAulaUnlocked, getUnlockDate } from '../utils/aulaUnlock'
import GlowOrb from '../components/GlowOrb'
import Card from '../components/Card'
import ScrollReveal from '../components/ScrollReveal'
import styles from './Aulas.module.css'

// Orb positions scattered across the sky like stars/constellations
const orbPositions = [
  { top: '10%', left: '58%' },   // Right sky
  { top: '8%',  left: '4%' },    // Far left sky
  { top: '22%', left: '88%' },   // Far right
  { top: '28%', left: '75%' },   // Right sky mid
  { top: '16%', left: '82%' },   // Right sky upper
  { top: '35%', left: '82%' },   // Right mid
  { top: '5%',  left: '8%' },    // Upper left
  { top: '32%', left: '68%' },   // Right of tree
  { top: '20%', left: '65%' },   // Right of crown
  { top: '40%', left: '90%' },   // Far right low
]

export default function Aulas() {
  const navigate = useNavigate()
  const { aulas } = aulasData

  const scrollToAula = (id) => {
    const el = document.getElementById(`aula-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className={styles.main}>
      {/* Tree Scene */}
      <section className={styles.treeScene}>
        <div className={styles.treeContainer}>
          <img
            src={`${import.meta.env.BASE_URL}bg-aulas.png`}
            alt=""
            className={styles.treeImage}
          />

          {/* Title overlay */}
          <motion.h1
            className={styles.treeTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            A Árvore do Saber
          </motion.h1>

          {/* Star orbs — always visible, clickable */}
          {aulas.map((aula, i) => (
            <GlowOrb
              key={aula.id}
              isActive
              position={orbPositions[i]}
              size={14 + (i % 3) * 6}
              delay={i * 0.15}
              label={`Aula ${aula.id}`}
              onClick={() => scrollToAula(aula.id)}
            />
          ))}
        </div>
      </section>

      {/* Aulas List */}
      <section className={styles.aulasSection}>
        <ScrollReveal>
          <h2 className={styles.sectionTitle}>Programa do Curso</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className={styles.sectionDivider}>
            <svg width="200" height="20" viewBox="0 0 200 20">
              <line x1="0" y1="10" x2="85" y2="10" stroke="var(--accent-purple)" strokeWidth="1" opacity="0.3" />
              <circle cx="100" cy="10" r="3" fill="var(--accent-glow)" opacity="0.4" />
              <line x1="115" y1="10" x2="200" y2="10" stroke="var(--accent-purple)" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>
        </ScrollReveal>

        <div className={styles.aulasList}>
          {aulas.map((aula, i) => {
            const unlocked = isAulaUnlocked(aula.id)
            return (
              <div key={aula.id} id={`aula-${aula.id}`}>
                <Card
                  variant="aula-lista"
                  numero={aula.id}
                  titulo={aula.titulo}
                  descricao={aula.descricao}
                  topicosCount={aula.topicos.length}
                  onClick={() => navigate(`/aulas/${aula.id}`)}
                  animationDelay={i * 0.08}
                  locked={!unlocked}
                  unlockDate={getUnlockDate(aula.id)}
                />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
