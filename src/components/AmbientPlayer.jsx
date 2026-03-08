import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiMusicalNotes } from 'react-icons/gi'
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiVolumeX } from 'react-icons/fi'
import styles from './AmbientPlayer.module.css'

const tracks = [
  { file: 'back_drop-dark-ambient-background-music-a-hundred-windows-324097.mp3', name: 'A Hundred Windows' },
  { file: 'back_drop-dark-ambient-background-music-polluted-horizons-244007.mp3', name: 'Polluted Horizons' },
  { file: 'clavier-music-dark-ambient-music-354475.mp3', name: 'Clavier' },
  { file: 'numbthefeelings-dark-ambient-relaxing-instrumental-445781.mp3', name: 'Numb the Feelings' },
  { file: 'xptlmusic-endless-falls-dark-ambient-ambient-music-sad-music-by-ariez-223935.mp3', name: 'Endless Falls' },
]

export default function AmbientPlayer() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [trackIndex, setTrackIndex] = useState(0)
  const [volume, setVolume] = useState(0.1)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef(null)

  // Autoplay on mount
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = `${import.meta.env.BASE_URL}audio/${tracks[0].file}`
    audio.volume = volume
    audio.play().catch(() => {
      // Browser blocked autoplay — play on first user interaction
      const tryPlay = () => {
        audio.play().then(() => {
          setPlaying(true)
          document.removeEventListener('click', tryPlay)
          document.removeEventListener('keydown', tryPlay)
        }).catch(() => {})
      }
      setPlaying(false)
      document.addEventListener('click', tryPlay, { once: false })
      document.addEventListener('keydown', tryPlay, { once: false })
    })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = `${import.meta.env.BASE_URL}audio/${tracks[trackIndex].file}`
    if (playing) {
      audio.play().catch(() => {})
    }
  }, [trackIndex])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [playing])

  const nextTrack = useCallback(() => {
    setTrackIndex(i => (i + 1) % tracks.length)
  }, [])

  const prevTrack = useCallback(() => {
    setTrackIndex(i => (i - 1 + tracks.length) % tracks.length)
  }, [])

  const handleEnded = useCallback(() => {
    nextTrack()
  }, [nextTrack])

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} onEnded={handleEnded} preload="none" />

      <motion.button
        className={`${styles.fab} ${playing ? styles.fabActive : ''}`}
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Player de música ambiente"
      >
        <GiMusicalNotes size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.trackName}>{tracks[trackIndex].name}</p>

            <div className={styles.controls}>
              <button className={styles.controlBtn} onClick={prevTrack} aria-label="Faixa anterior">
                <FiSkipBack size={16} />
              </button>
              <button className={styles.playBtn} onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
                {playing ? <FiPause size={18} /> : <FiPlay size={18} />}
              </button>
              <button className={styles.controlBtn} onClick={nextTrack} aria-label="Próxima faixa">
                <FiSkipForward size={16} />
              </button>
            </div>

            <div className={styles.volumeRow}>
              <button
                className={styles.controlBtn}
                onClick={() => setMuted(m => !m)}
                aria-label={muted ? 'Ativar som' : 'Mutar'}
              >
                {muted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={e => {
                  setVolume(parseFloat(e.target.value))
                  setMuted(false)
                }}
                className={styles.volumeSlider}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
