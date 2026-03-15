import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Antropologia do Ocultismo
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.menuOpen : ''}`}>
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? styles.active : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/aulas"
              className={location.pathname.startsWith('/aulas') ? styles.active : ''}
            >
              Aulas
            </Link>
          </li>
          <li>
            <Link
              to="/chamada"
              className={location.pathname === '/chamada' ? styles.active : ''}
            >
              Chamada
            </Link>
          </li>
          <li>
            <Link
              to="/mural"
              className={location.pathname === '/mural' ? styles.active : ''}
            >
              Mural
            </Link>
          </li>
          <li>
            <Link
              to="/ranking"
              className={location.pathname === '/ranking' ? styles.active : ''}
            >
              Ranking
            </Link>
          </li>
          <li>
            <Link
              to="/oraculo"
              className={location.pathname === '/oraculo' ? styles.active : ''}
            >
              Oráculo
            </Link>
          </li>
        </ul>
      </div>
    </motion.nav>
  )
}
