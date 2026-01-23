// Funcions per gestionar els rankings amb l'API

const API_URL = '/api/rankings'

/**
 * Obté els rankings de la base de dades
 * @returns {Promise<Array<{nom: string, puntuacio: number, data: string}>>}
 */
export async function obtenirRanking() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Error obtenint rankings')
    }
    const data = await response.json()
    // Transformar els camps per compatibilitat amb el frontend existent
    return data.map(entry => ({
      name: entry.nom,
      score: entry.puntuacio,
      time: entry.temps || 0,
      date: entry.data,
    }))
  } catch (error) {
    console.error('Error obtenint rankings:', error)
    return []
  }
}

/**
 * Guarda un nou ranking a la base de dades
 * @param {string} nom - Nom del jugador
 * @param {number} puntuacio - Puntuació (1-100)
 * @param {number} temps - Temps en segons
 * @returns {Promise<boolean>} - true si s'ha guardat correctament
 */
export async function guardarRanking(nom, puntuacio, temps) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, puntuacio, temps }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error guardant ranking')
    }

    return true
  } catch (error) {
    console.error('Error guardant ranking:', error)
    return false
  }
}
