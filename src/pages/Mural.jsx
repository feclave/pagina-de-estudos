import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiCheck } from 'react-icons/fi'
import Starfield from '../components/Starfield'
import ScrollReveal from '../components/ScrollReveal'
import styles from './Mural.module.css'

const SCRIPT_URL = import.meta.env.VITE_MURAL_SCRIPT_URL || ''

export default function Mural() {
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [mensagens, setMensagens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMensagens()
  }, [])

  async function fetchMensagens() {
    try {
      // Apps Script redirects on doGet — follow redirect to get JSON
      const res = await fetch(SCRIPT_URL, { redirect: 'follow' })
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setMensagens(Array.isArray(data) ? data.reverse() : [])
    } catch {
      // silent fail — mural just shows empty
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!mensagem.trim()) return

    setStatus('sending')

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: mensagem.trim() }),
      })

      setStatus('success')
      setMensagem('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const charLimit = 280

  return (
    <main className={styles.main}>
      <Starfield moon="full" />
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Mural da Sala</h1>
          <p className={styles.subtitle}>
            Compartilhe pensamentos, reflexões e insights com a turma.
            <br />
            <span className={styles.anonNote}>Todas as mensagens são anônimas.</span>
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          className={styles.formCard}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <textarea
            className={styles.textarea}
            value={mensagem}
            onChange={e => {
              if (e.target.value.length <= charLimit) setMensagem(e.target.value)
            }}
            placeholder="Escreva sua mensagem..."
            rows={3}
            disabled={status === 'sending'}
          />
          <div className={styles.formFooter}>
            <span className={styles.charCount}>
              {mensagem.length}/{charLimit}
            </span>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.span
                  key="success"
                  className={styles.successBadge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <FiCheck size={14} />
                  Enviada! Aguarde aprovação.
                </motion.span>
              ) : status === 'error' ? (
                <motion.span
                  key="error"
                  className={styles.errorBadge}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Erro ao enviar. Tente novamente.
                </motion.span>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={!mensagem.trim() || status === 'sending'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiSend size={14} />
                  {status === 'sending' ? 'Enviando...' : 'Enviar'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* Messages */}
        <section className={styles.muralSection}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingOrb} />
              <p>Carregando mensagens...</p>
            </div>
          ) : mensagens.length === 0 ? (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p>Nenhuma mensagem no mural ainda.</p>
              <p className={styles.emptyHint}>Seja o primeiro a compartilhar!</p>
            </motion.div>
          ) : (
            <div className={styles.muralGrid}>
              {mensagens.map((msg, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className={styles.postit}>
                    <p className={styles.postitText}>{msg.mensagem}</p>
                    <span className={styles.postitDate}>
                      {new Date(msg.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
