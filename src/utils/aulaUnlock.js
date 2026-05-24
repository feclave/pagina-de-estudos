// 1º Semestre: Aula 1 sempre aberta; aulas 2–8 abriram semanalmente a partir de 11/03/2026
const AULA_2_UNLOCK = new Date('2026-03-11T00:00:00-03:00')

// 2º Semestre: Aula 9 abre em 25/05/2026; aulas 10–16 abrem semanalmente a partir daí
const AULA_9_UNLOCK = new Date('2026-05-24T00:00:00-03:00')

// Dynamics unlock the Monday after the class (Sunday)
const DINAMICA_1_UNLOCK = new Date('2026-03-09T00:00:00-03:00')

function getNowBRT() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc - 3 * 3600000)
}

function getUnlockTimestamp(aulaId) {
  if (aulaId <= 1) return null
  if (aulaId <= 8) return new Date(AULA_2_UNLOCK.getTime() + (aulaId - 2) * 7 * 24 * 3600000)
  return new Date(AULA_9_UNLOCK.getTime() + (aulaId - 9) * 7 * 24 * 3600000)
}

export function isAulaUnlocked(aulaId) {
  if (aulaId <= 1) return true
  const now = getNowBRT()
  return now >= getUnlockTimestamp(aulaId)
}

export function getUnlockDate(aulaId) {
  if (aulaId <= 1) return null
  const date = getUnlockTimestamp(aulaId)
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
