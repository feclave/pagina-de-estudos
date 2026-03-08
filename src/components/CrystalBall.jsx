import { useRef, useEffect } from 'react'
import styles from './CrystalBall.module.css'

const PARTICLE_COUNT = 60
const TAU = Math.PI * 2

function createParticles(w, h) {
  const cx = w / 2
  const cy = h / 2
  const radius = w * 0.38
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * TAU
    const dist = Math.random() * radius * 0.85
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 18 + 6,
      opacity: Math.random() * 0.12 + 0.03,
      phase: Math.random() * TAU,
      speed: Math.random() * 0.008 + 0.003,
      drift: Math.random() * 0.4 + 0.1,
    }
  })
}

export default function CrystalBall() {
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const size = canvas.parentElement.clientWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const w = size
    const h = size
    const cx = w / 2
    const cy = h / 2
    const ballRadius = w * 0.42

    particlesRef.current = createParticles(w, h)
    let t = 0

    function draw() {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // clip to circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, ballRadius, 0, TAU)
      ctx.clip()

      // draw particles as soft blobs
      for (const p of particlesRef.current) {
        p.phase += p.speed
        p.x += Math.cos(p.phase) * p.drift + p.vx
        p.y += Math.sin(p.phase * 0.7) * p.drift + p.vy

        // keep inside sphere
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxR = ballRadius * 0.88
        if (dist > maxR) {
          const angle = Math.atan2(dy, dx)
          p.x = cx + Math.cos(angle) * maxR
          p.y = cy + Math.sin(angle) * maxR
          p.vx *= -0.5
          p.vy *= -0.5
        }

        const pulse = 0.7 + 0.3 * Math.sin(p.phase * 2)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        const warmR = 200 + Math.floor(Math.sin(p.phase) * 45)
        const warmG = 180 + Math.floor(Math.sin(p.phase + 1) * 40)
        const warmB = 160 + Math.floor(Math.cos(p.phase) * 50)
        grad.addColorStop(0, `rgba(${warmR}, ${warmG}, ${warmB}, ${p.opacity * pulse})`)
        grad.addColorStop(0.5, `rgba(${warmR - 40}, ${warmG - 30}, ${warmB + 20}, ${p.opacity * pulse * 0.4})`)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, TAU)
        ctx.fill()
      }

      // slow swirling core glow
      const corePhase = t * 0.012
      const coreCx = cx + Math.cos(corePhase) * 8
      const coreCy = cy + Math.sin(corePhase * 0.7) * 6
      const coreGrad = ctx.createRadialGradient(coreCx, coreCy, 0, coreCx, coreCy, ballRadius * 0.5)
      const coreAlpha = 0.06 + 0.03 * Math.sin(corePhase * 2)
      coreGrad.addColorStop(0, `rgba(245, 222, 179, ${coreAlpha})`)
      coreGrad.addColorStop(0.6, `rgba(180, 140, 200, ${coreAlpha * 0.4})`)
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = coreGrad
      ctx.fillRect(0, 0, w, h)

      ctx.restore()

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.ball}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.glassOverlay} />
        <div className={styles.shine} />
        <div className={styles.rim} />
      </div>
      <div className={styles.base}>
        <div className={styles.baseTop} />
        <div className={styles.baseBottom} />
      </div>
      <div className={styles.tableGlow} />
    </div>
  )
}
