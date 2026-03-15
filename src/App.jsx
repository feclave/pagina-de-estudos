import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParticleField from './components/ParticleField'
import AmbientPlayer from './components/AmbientPlayer'

const Home = lazy(() => import('./pages/Home'))
const Aulas = lazy(() => import('./pages/Aulas'))
const AulaDetalhe = lazy(() => import('./pages/AulaDetalhe'))
const Chamada = lazy(() => import('./pages/Chamada'))
const Oraculo = lazy(() => import('./pages/Oraculo'))
const Mural = lazy(() => import('./pages/Mural'))
const Ranking = lazy(() => import('./pages/Ranking'))

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/aulas"
          element={
            <PageWrapper>
              <Aulas />
            </PageWrapper>
          }
        />
        <Route
          path="/aulas/:id"
          element={
            <PageWrapper>
              <AulaDetalhe />
            </PageWrapper>
          }
        />
        <Route
          path="/chamada"
          element={
            <PageWrapper>
              <Chamada />
            </PageWrapper>
          }
        />
        <Route
          path="/oraculo"
          element={
            <PageWrapper>
              <Oraculo />
            </PageWrapper>
          }
        />
        <Route
          path="/mural"
          element={
            <PageWrapper>
              <Mural />
            </PageWrapper>
          }
        />
        <Route
          path="/ranking"
          element={
            <PageWrapper>
              <Ranking />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <ParticleField count={20} />
      <Navbar />
      <Suspense
        fallback={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff8e7, #f5deb3)',
              boxShadow: '0 0 30px rgba(245, 222, 179, 0.4)',
            }} />
          </div>
        }
      >
        <AnimatedRoutes />
      </Suspense>
      <Footer />
      <AmbientPlayer />
    </HashRouter>
  )
}
