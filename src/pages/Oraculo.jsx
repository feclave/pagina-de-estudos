import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import oraculo from '../data/oraculo.json'
import CrystalBall from '../components/CrystalBall'
import Starfield from '../components/Starfield'
import styles from './Oraculo.module.css'

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
}

function commonPrefix(a, b) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

function fuzzyMatch(word, kw) {
  if (word === kw) return 3
  if (kw.includes(word) || word.includes(kw)) return 1
  const prefixLen = commonPrefix(word, kw)
  if (prefixLen >= 5) return 2
  if (prefixLen >= 4 && Math.abs(word.length - kw.length) <= 2) return 1
  return 0
}

function findBestMatch(pergunta) {
  const words = normalize(pergunta)
    .split(/\s+/)
    .filter(w => w.length > 2)

  if (words.length === 0) return null

  let best = null
  let bestScore = 0

  for (const entrada of oraculo.entradas) {
    let score = 0
    for (const word of words) {
      for (const kw of entrada.keywords) {
        score += fuzzyMatch(word, normalize(kw))
      }
      // also match against title words
      for (const tw of normalize(entrada.titulo).split(/\s+/)) {
        score += fuzzyMatch(word, tw)
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = entrada
    }
  }

  // require minimum score to avoid weak matches
  if (bestScore < 3) return null
  return best
}

function getFallback() {
  const msgs = oraculo.fallback
  return msgs[Math.floor(Math.random() * msgs.length)]
}

function getRandomEntry(exclude) {
  const pool = exclude
    ? oraculo.entradas.filter(e => e.id !== exclude.id)
    : oraculo.entradas
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function Oraculo() {
  const [pergunta, setPergunta] = useState('')
  const [revelacao, setRevelacao] = useState(null)
  const [isFallback, setIsFallback] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)
  const revelacaoRef = useRef(null)

  function consultar() {
    if (revealing || pergunta.trim().length === 0) return

    setRevealing(true)
    setRevelacao(null)
    setIsFallback(false)

    setTimeout(() => {
      const match = findBestMatch(pergunta)
      if (match) {
        setRevelacao(match)
        setIsFallback(false)
        setHistory(prev => [{ pergunta: pergunta.trim(), resposta: match }, ...prev].slice(0, 5))
      } else {
        setRevelacao({ texto: getFallback() })
        setIsFallback(true)
      }
      setPergunta('')
      setRevealing(false)
    }, 2000)
  }

  function consultarAleatorio() {
    if (revealing) return
    setRevealing(true)
    setRevelacao(null)
    setIsFallback(false)
    setPergunta('')

    setTimeout(() => {
      const entry = getRandomEntry(revelacao && !isFallback ? revelacao : null)
      setRevelacao(entry)
      setIsFallback(false)
      setHistory(prev => [{ pergunta: '(consulta cega)', resposta: entry }, ...prev].slice(0, 5))
      setRevealing(false)
    }, 2000)
  }

  useEffect(() => {
    if (revelacao && revelacaoRef.current) {
      revelacaoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [revelacao])

  return (
    <main className={styles.page}>
      <Starfield moon="waning" />
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <CrystalBall />
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Oráculo das Sombras
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Consulte as Crônicas de Roxwood. Pergunte sobre o passado, entidades e eventos que marcaram esta cidade.
        </motion.p>
      </section>

      <section className={styles.consultaSection}>
        <motion.div
          className={styles.inputArea}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="O que deseja saber? Ex: Quem é Martha Carrier?"
            value={pergunta}
            onChange={e => setPergunta(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && consultar()}
            disabled={revealing}
          />
          <div className={styles.buttonRow}>
            <button
              className={styles.btnConsultar}
              onClick={consultar}
              disabled={revealing || pergunta.trim().length === 0}
            >
              {revealing ? 'Consultando...' : 'Consultar o Oráculo'}
            </button>
            <button
              className={styles.btnAleatorio}
              onClick={consultarAleatorio}
              disabled={revealing}
            >
              Consulta Cega
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {revealing && (
            <motion.div
              className={styles.loadingOracle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.pulseOrb} />
              <p className={styles.loadingText}>As sombras sussurram...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {revelacao && !revealing && (
            <motion.div
              ref={revelacaoRef}
              className={styles.revelacao}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className={styles.revelacaoGlow} />
              {revelacao.titulo && (
                <h3 className={styles.revelacaoTitulo}>{revelacao.titulo}</h3>
              )}
              <blockquote className={styles.fragmento}>
                {revelacao.texto}
              </blockquote>
              {revelacao.fonte && (
                <cite className={styles.fonte}>
                  — {revelacao.fonte}
                </cite>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {history.length > 1 && (
        <section className={styles.historySection}>
          <h2 className={styles.historyTitle}>Consultas Anteriores</h2>
          <div className={styles.historyList}>
            {history.slice(1).map((item, i) => (
              <motion.div
                key={i}
                className={styles.historyItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className={styles.historyPergunta}>{item.pergunta}</p>
                <p className={styles.historyResposta}>
                  {item.resposta.titulo && <strong>{item.resposta.titulo}: </strong>}
                  {item.resposta.texto.length > 150
                    ? item.resposta.texto.slice(0, 150) + '...'
                    : item.resposta.texto}
                </p>
                {item.resposta.fonte && (
                  <span className={styles.historyFonte}>— {item.resposta.fonte}</span>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
