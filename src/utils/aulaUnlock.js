// Aula 1: always open
// Aula 2: unlocks Wed March 11, 2026
// Aula N (N>=2): unlocks March 11 + (N-2) * 7 days
const AULA_2_UNLOCK = new Date('2026-03-11T00:00:00-03:00')

// Dynamics unlock the Monday after the class (Sunday)
// Aula 1 class: Sun March 8 → dynamic visible Mon March 9
// Aula N dynamic: March 9 + (N-1) * 7 days
const DINAMICA_1_UNLOCK = new Date('2026-03-09T00:00:00-03:00')

function getNowBRT() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc - 3 * 3600000)
}

export function isAulaUnlocked(aulaId) {
  if (aulaId <= 1) return true
  const now = getNowBRT()
  const unlockDate = new Date(AULA_2_UNLOCK.getTime() + (aulaId - 2) * 7 * 24 * 3600000)
  return now >= unlockDate
}

export function getUnlockDate(aulaId) {
  if (aulaId <= 1) return null
  const date = new Date(AULA_2_UNLOCK.getTime() + (aulaId - 2) * 7 * 24 * 3600000)
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ]
  return `${date.getDate()} de ${meses[date.getMonth()]}`
}

export function isDinamicaUnlocked(aulaId) {
  const now = getNowBRT()
  const unlockDate = new Date(DINAMICA_1_UNLOCK.getTime() + (aulaId - 1) * 7 * 24 * 3600000)
  return now >= unlockDate
}
