import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { GiPadlock } from 'react-icons/gi'
import Starfield from '../components/Starfield'
import styles from './Chamada.module.css'

const SCRIPT_URL = import.meta.env.VITE_CHAMADA_SCRIPT_URL || ''

function getNow() {
  // Brazil time (UTC-3)
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc - 3 * 3600000)
}

function isChamadaAberta() {
  const now = getNow()
  const dia = now.getDay() // 0 = Sunday
  if (dia !== 0) return false
  const hora = now.getHours() + now.getMinutes() / 60
  return hora >= 21 && hora < 24
}

function getProximaAula() {
  const now = getNow()
  const dia = now.getDay()

  if (dia === 0) {
    const hora = now.getHours() + now.getMinutes() / 60
    if (hora < 21) return 'hoje às 21:00'
  }

  const diasAte = dia === 0 ? 7 : 7 - dia
  const proxDomingo = new Date(now)
  proxDomingo.setDate(now.getDate() + diasAte)

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ]
  return `domingo, ${proxDomingo.getDate()} de ${meses[proxDomingo.getMonth()]}`
}

export default function Chamada() {
  const [nome, setNome] = useState('')
  const [idAluno, setIdAluno] = useState('')
  const [aberta, setAberta] = useState(isChamadaAberta)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  // Check every 30 seconds if chamada opened/closed
  useEffect(() => {
    const interval = setInterval(() => {
      setAberta(isChamadaAberta())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const proximaAula = useMemo(() => getProximaAula(), [aberta])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !idAluno.trim()) return

    setStatus('sending')
    setErrorMsg('')

    try {
      if (!isChamadaAberta()) {
        setStatus('error')
        setErrorMsg('A chamada não está aberta no momento.')
        return
      }

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          id: idAluno.trim(),
        }),
      })

      // no-cors returns opaque response, so we assume success
      setStatus('success')
      setNome('')
      setIdAluno('')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Erro ao registrar presença. Tente novamente.')
    }
  }

  return (
    <main className={styles.main}>
      <Starfield moon="crescent" />
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Lista de Chamada</h1>
          <p className={styles.subtitle}>
            Registre sua presença na aula
          </p>

          <div className={styles.horarioInfo}>
            <span className={styles.horarioDot} data-aberta={aberta} />
            <span>Domingo, 21:00 - 00:00</span>
          </div>

          <AnimatePresence mode="wait">
            {aberta ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.statusAberta}>
                  Chamada aberta
                </div>

                {status === 'success' ? (
                  <motion.div
                    className={styles.successMsg}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className={styles.successIcon}><FiCheck size={22} /></span>
                    <p>Presença registrada com sucesso!</p>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => setStatus('idle')}
                    >
                      Registrar outro aluno
                    </button>
                  </motion.div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                      <label htmlFor="nome">Nome completo</label>
                      <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Seu nome"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="idAluno">ID (matrícula)</label>
                      <input
                        id="idAluno"
                        type="text"
                        value={idAluno}
                        onChange={e => setIdAluno(e.target.value)}
                        placeholder="Sua matrícula ou ID"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>

                    {status === 'error' && (
                      <p className={styles.errorMsg}>{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      className={styles.btnSubmit}
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Registrando...' : 'Registrar Presença'}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="closed"
                className={styles.closedMsg}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.closedIcon}><GiPadlock size={40} /></div>
                <p>A chamada está fechada no momento.</p>
                <p className={styles.closedDetail}>
                  As aulas acontecem todo domingo à noite.
                  <br />
                  Próxima aula: <strong>{proximaAula}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
