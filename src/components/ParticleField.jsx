import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

export default function ParticleField({ count = 20 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = styles.particle

      const size = 2 + Math.random() * 4
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = 8 + Math.random() * 12
      const delay = Math.random() * duration
      const driftX = -30 + Math.random() * 60
      const driftY = -40 + Math.random() * -20

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `

      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(p => p.remove())
    }
  }, [count])

  return <div ref={containerRef} className={styles.field} />
}
