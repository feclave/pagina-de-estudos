import { useEffect, useRef } from 'react'
import { WiMoonFull, WiMoonWaxingCrescent3, WiMoonWaningCrescent3 } from 'react-icons/wi'
import styles from './Starfield.module.css'

const moonIcons = {
  full: WiMoonFull,
  crescent: WiMoonWaxingCrescent3,
  waning: WiMoonWaningCrescent3,
}

// moon prop: "full" | "crescent" | "waning" | undefined (no moon)
export default function Starfield({ moon }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId
    let width, height

    const stars = []
    const STAR_COUNT = 200
    const shootingStars = []

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio
      height = canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      initStars()
    }

    function initStars() {
      stars.length = 0
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 0.3 + Math.random() * 1.5,
          alpha: 0.2 + Math.random() * 0.8,
          twinkleSpeed: 0.005 + Math.random() * 0.02,
          twinkleOffset: Math.random() * Math.PI * 2,
          hue: 35 + Math.random() * 15,
          sat: 20 + Math.random() * 40,
        })
      }
    }

    function spawnShootingStar() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4)
      const speed = 4 + Math.random() * 4
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.008 + Math.random() * 0.008,
        length: 40 + Math.random() * 60,
      })
    }

    let time = 0
    let nextShoot = 3000 + Math.random() * 5000
    let shootTimer = 0

    function draw(dt) {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      time += dt

      // Nebula glow
      const nebula1 = ctx.createRadialGradient(
        w * 0.3, h * 0.4, 0,
        w * 0.3, h * 0.4, w * 0.4
      )
      nebula1.addColorStop(0, 'rgba(107, 76, 110, 0.06)')
      nebula1.addColorStop(0.5, 'rgba(107, 76, 110, 0.03)')
      nebula1.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula1
      ctx.fillRect(0, 0, w, h)

      const nebula2 = ctx.createRadialGradient(
        w * 0.75, h * 0.6, 0,
        w * 0.75, h * 0.6, w * 0.35
      )
      nebula2.addColorStop(0, 'rgba(155, 126, 168, 0.04)')
      nebula2.addColorStop(0.5, 'rgba(155, 126, 168, 0.02)')
      nebula2.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula2
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        const alpha = star.alpha * (0.5 + 0.5 * twinkle)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, ${star.sat}%, 90%, ${alpha})`
        ctx.fill()

        if (star.radius > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          )
          glow.addColorStop(0, `hsla(${star.hue}, ${star.sat}%, 90%, ${alpha * 0.3})`)
          glow.addColorStop(1, 'transparent')
          ctx.fillStyle = glow
          ctx.fill()
        }
      }

      // Shooting stars
      shootTimer += dt
      if (shootTimer > nextShoot) {
        spawnShootingStar()
        shootTimer = 0
        nextShoot = 4000 + Math.random() * 8000
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay

        if (s.life <= 0) {
          shootingStars.splice(i, 1)
          continue
        }

        const tailX = s.x - s.vx * s.length * 0.15
        const tailY = s.y - s.vy * s.length * 0.15
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(1, `rgba(245, 222, 179, ${s.life * 0.7})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 248, 231, ${s.life * 0.9})`
        ctx.fill()
      }
    }

    let lastTime = performance.now()
    function animate(now) {
      const dt = now - lastTime
      lastTime = now
      draw(dt)
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animationId = requestAnimationFrame(animate)

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationId)
      resize()
      lastTime = performance.now()
      animationId = requestAnimationFrame(animate)
    })
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
    }
  }, [])

  const MoonIcon = moon ? moonIcons[moon] : null

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {MoonIcon && (
        <div className={styles.moonContainer}>
          <div className={styles.moonGlow} />
          <MoonIcon className={styles.moonIcon} />
        </div>
      )}
    </div>
  )
}
