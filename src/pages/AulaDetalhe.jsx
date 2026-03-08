import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiDiamondHard, GiPadlock } from 'react-icons/gi'
import { FiZap } from 'react-icons/fi'
import aulasData from '../data/aulas.json'
import dinamicasData from '../data/dinamicas.json'
import { isAulaUnlocked, getUnlockDate, isDinamicaUnlocked } from '../utils/aulaUnlock'
import ScrollReveal from '../components/ScrollReveal'
import Card from '../components/Card'
import styles from './AulaDetalhe.module.css'

export default function AulaDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { aulas } = aulasData

  const aulaIndex = aulas.findIndex(a => a.id === parseInt(id))
  const aula = aulas[aulaIndex]

  if (!aula) {
    return (
      <main className={styles.notFound}>
        <h1>Aula não encontrada</h1>
        <Link to="/aulas">Voltar para Aulas</Link>
      </main>
    )
  }

  if (!isAulaUnlocked(aula.id)) {
    return (
      <main className={styles.notFound}>
        <h1>Aula bloqueada</h1>
        <p>Esta aula será liberada em {getUnlockDate(aula.id)}.</p>
        <Link to="/aulas">Voltar para Aulas</Link>
      </main>
    )
  }

  const prev = aulaIndex > 0 ? aulas[aulaIndex - 1] : null
  const nextAula = aulaIndex < aulas.length - 1 ? aulas[aulaIndex + 1] : null
  const next = nextAula && isAulaUnlocked(nextAula.id) ? nextAula : null

  // Parse content into blocks: paragraphs and tables
  const contentBlocks = []
  const raw = aula.conteudo
  let cursor = 0
  const tableRegex = /\[TABELA\]([\s\S]*?)\[\/TABELA\]/g
  let match
  while ((match = tableRegex.exec(raw)) !== null) {
    // Add paragraphs before this table
    const before = raw.slice(cursor, match.index).trim()
    if (before) {
      before.split('\n\n').forEach(p => {
        if (p.trim()) contentBlocks.push({ type: 'paragraph', text: p.trim() })
      })
    }
    // Parse table: first line = headers, rest = rows, separated by |
    const tableLines = match[1].trim().split('\n').filter(l => l.trim())
    const headers = tableLines[0].split('|').map(h => h.trim())
    const rows = tableLines.slice(1).map(line => line.split('|').map(c => c.trim()))
    contentBlocks.push({ type: 'table', headers, rows })
    cursor = match.index + match[0].length
  }
  // Add remaining paragraphs after last table
  const remaining = raw.slice(cursor).trim()
  if (remaining) {
    remaining.split('\n\n').forEach(p => {
      if (p.trim()) contentBlocks.push({ type: 'paragraph', text: p.trim() })
    })
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerOverlay} />
        <div className={styles.headerContent}>
          <motion.span
            className={styles.aulaNum}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Aula {String(aula.id).padStart(2, '0')}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {aula.titulo}
          </motion.h1>

          <motion.p
            className={styles.descricao}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {aula.descricao}
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.content}>
          {/* Topics sidebar / section */}
          <ScrollReveal>
            <aside className={styles.topics}>
              <h3 className={styles.topicsTitle}>Tópicos</h3>
              <ul className={styles.topicsList}>
                {aula.topicos.map((topico, i) => (
                  <li key={i} className={styles.topicItem}>
                    <GiDiamondHard className={styles.topicBullet} size={10} />
                    {topico}
                  </li>
                ))}
              </ul>
            </aside>
          </ScrollReveal>

          {/* Conto Mitológico */}
          {aula.conto && (
            <ScrollReveal>
              <div className={styles.contoSection}>
                <div className={styles.contoHeader}>
                  <h3 className={styles.contoTitulo}>{aula.conto.titulo}</h3>
                  <span className={styles.contoOrigem}>{aula.conto.origem}</span>
                </div>
                <p className={styles.contoTexto}>{aula.conto.texto}</p>
              </div>
            </ScrollReveal>
          )}

          {/* Main text */}
          <article className={styles.article}>
            {contentBlocks.map((block, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                {block.type === 'paragraph' ? (
                  <p className={styles.paragraph}>{block.text}</p>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.arcanoTable}>
                      <thead>
                        <tr>
                          {block.headers.map((h, j) => (
                            <th key={j}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, j) => (
                          <tr key={j}>
                            {row.map((cell, k) => (
                              <td key={k}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </article>

          {/* Dinâmica */}
          {(() => {
            const dinamica = dinamicasData[String(aula.id)]
            if (!dinamica) return null
            const unlocked = isDinamicaUnlocked(aula.id)

            return (
              <section className={styles.dinamicaSection}>
                <ScrollReveal>
                  <div className={styles.dinamicaHeader}>
                    <FiZap className={styles.dinamicaIcon} size={18} />
                    <h3 className={styles.dinamicaTitle}>Dinâmica</h3>
                  </div>
                </ScrollReveal>

                {unlocked ? (
                  <ScrollReveal delay={0.1}>
                    <div className={styles.dinamicaCard}>
                      <h4 className={styles.dinamicaNome}>{dinamica.titulo}</h4>
                      <p className={styles.dinamicaSub}>{dinamica.subtitulo}</p>

                      <div className={styles.dinamicaBloco}>
                        <h5 className={styles.dinamicaBlocoTitulo}>Preparação</h5>
                        <ul className={styles.dinamicaLista}>
                          {dinamica.preparacao.map((item, i) => (
                            <li key={i}>
                              <GiDiamondHard className={styles.topicBullet} size={8} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.dinamicaBloco}>
                        <h5 className={styles.dinamicaBlocoTitulo}>Regras</h5>
                        <ol className={styles.dinamicaRegras}>
                          {dinamica.regras.map((regra, i) => (
                            <li key={i}>{regra}</li>
                          ))}
                        </ol>
                      </div>

                      <div className={styles.dinamicaInsight}>
                        <strong>Por que funciona:</strong> {dinamica.porque_funciona}
                      </div>
                    </div>
                  </ScrollReveal>
                ) : (
                  <ScrollReveal delay={0.1}>
                    <div className={styles.dinamicaLocked}>
                      <GiPadlock size={24} />
                      <p>A dinâmica será revelada após a aula acontecer.</p>
                    </div>
                  </ScrollReveal>
                )}
              </section>
            )
          })()}

          {/* Leitura complementar */}
          {aula.leitura_complementar && aula.leitura_complementar.length > 0 && (
            <section className={styles.leituraSection}>
              <ScrollReveal>
                <h3 className={styles.leituraTitle}>Leitura Complementar</h3>
              </ScrollReveal>
              <div className={styles.leituraGrid}>
                {aula.leitura_complementar.map((livro, i) => (
                  <Card
                    key={i}
                    variant="bibliografia"
                    titulo={livro.titulo}
                    descricao={livro.autor}
                    animationDelay={i * 0.15}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.navBottom}>
          <div className={styles.navSide}>
            {prev && (
              <button
                className={styles.navBtn}
                onClick={() => navigate(`/aulas/${prev.id}`)}
              >
                <span className={styles.navLabel}>← Aula anterior</span>
                <span className={styles.navName}>{prev.titulo}</span>
              </button>
            )}
          </div>
          <div className={`${styles.navSide} ${styles.navRight}`}>
            {next && (
              <button
                className={styles.navBtn}
                onClick={() => navigate(`/aulas/${next.id}`)}
              >
                <span className={styles.navLabel}>Próxima aula →</span>
                <span className={styles.navName}>{next.titulo}</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Back button */}
      <motion.button
        className={styles.backBtn}
        onClick={() => navigate('/aulas')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Aulas
      </motion.button>
    </main>
  )
}
