import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Starfield from '../components/Starfield'
import ScrollReveal from '../components/ScrollReveal'
import styles from './Ranking.module.css'

const SCRIPT_URL = import.meta.env.VITE_RANKING_SCRIPT_URL || ''

export default function Ranking() {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [turmaAtiva, setTurmaAtiva] = useState(1)

  useEffect(() => {
    fetchRanking()
  }, [])

  async function fetchRanking() {
    try {
      const res = await fetch(SCRIPT_URL, { redirect: 'follow' })
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      setAlunos(Array.isArray(json.data) ? json.data : [])
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  const alunosTurma = alunos
    .filter(a => a.turma === turmaAtiva)
    .sort((a, b) => b.pontuacao - a.pontuacao)

  const maxPontuacao = alunosTurma.length > 0
    ? Math.max(...alunosTurma.map(a => a.pontuacao))
    : 1

  return (
    <main className={styles.main}>
      <Starfield />
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Ranking</h1>
          <p className={styles.subtitle}>
            Acompanhe a pontuação e participação dos alunos.
          </p>
        </motion.div>

        {/* Turma tabs */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            className={`${styles.tab} ${turmaAtiva === 1 ? styles.tabActive : ''}`}
            onClick={() => setTurmaAtiva(1)}
          >
            Turma 1
          </button>
          <button
            className={`${styles.tab} ${turmaAtiva === 2 ? styles.tabActive : ''}`}
            onClick={() => setTurmaAtiva(2)}
          >
            Turma 2
          </button>
        </motion.div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingOrb} />
            <p>Carregando ranking...</p>
          </div>
        ) : alunosTurma.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>Nenhum aluno registrado nesta turma.</p>
          </motion.div>
        ) : (
          <>
            {/* Bar chart */}
            <ScrollReveal>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  {alunosTurma.map((aluno, i) => {
                    const pct = maxPontuacao > 0
                      ? (aluno.pontuacao / maxPontuacao) * 100
                      : 0
                    const isTop3 = i < 3
                    return (
                      <div key={i} className={styles.barCol}>
                        <span className={`${styles.barScore} ${isTop3 ? styles.scoreTop3 : ''}`}>
                          {aluno.pontuacao}
                        </span>
                        <div className={styles.barTrack}>
                          <motion.div
                            className={`${styles.barFill} ${isTop3 ? styles.barTop3 : ''}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(pct, 3)}%` }}
                            transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
                          />
                        </div>
                        <span className={styles.barName}>
                          {aluno.nome.split(' ')[0]}
                        </span>
                        <span className={styles.barPosition}>
                          {i + 1}º
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* List */}
            <ScrollReveal delay={0.2}>
              <div className={styles.listContainer}>
                <h2 className={styles.listTitle}>Listagem Completa</h2>
                <div className={styles.list}>
                  {alunosTurma.map((aluno, i) => (
                    <div
                      key={i}
                      className={`${styles.listItem} ${i < 3 ? styles.listItemTop3 : ''}`}
                    >
                      <div className={styles.listLeft}>
                        <span className={`${styles.listPosition} ${i < 3 ? styles.positionTop3 : ''}`}>
                          {i + 1}
                        </span>
                        <span className={styles.listName}>{aluno.nome}</span>
                      </div>
                      <span className={`${styles.listScore} ${i < 3 ? styles.scoreTop3 : ''}`}>
                        {aluno.pontuacao} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </main>
  )
}
