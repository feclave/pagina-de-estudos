import { GiCrystalBall, GiScrollUnfurled, GiMoonBats } from 'react-icons/gi'

const iconMap = {
  'crystal-ball': GiCrystalBall,
  'scroll': GiScrollUnfurled,
  'moon': GiMoonBats,
}

export default function CardIcon({ name, className, size }) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} size={size} />
}
