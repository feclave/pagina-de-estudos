// 1º Semestre: Aula 1 sempre aberta; aulas 2–8 abriram semanalmente a partir de 11/03/2026
const AULA_2_UNLOCK = new Date('2026-03-11T00:00:00-03:00')

// 2º Semestre: datas fixas por aula (aula 11 cancelada pulou uma semana)
const SEMESTRE_2_UNLOCKS = {
   9: new Date('2026-05-25T00:00:00-03:00'),
  10: new Date('2026-06-01T00:00:00-03:00'),
  11: new Date('2026-06-14T00:00:00-03:00'), // aula 11 — 14/06 (semana anterior cancelada)
  12: new Date('2026-06-21T00:00:00-03:00'),
  13: new Date('2026-06-28T00:00:00-03:00'),
  14: new Date('2026-07-12T00:00:00-03:00'),
  15: new Date('2026-07-19T00:00:00-03:00'),
}

// 3º Semestre: aula 16 liberada em 30/08, demais semanalmente
const AULA_16_UNLOCK = new Date('2026-08-30T00:00:00-03:00')

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
  if (aulaId <= 15) return SEMESTRE_2_UNLOCKS[aulaId] ?? null
  return new Date(AULA_16_UNLOCK.getTime() + (aulaId - 16) * 7 * 24 * 3600000)
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
