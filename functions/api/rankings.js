// API Cloudflare Pages Functions per als rankings
// GET /api/rankings - Retorna TOP 100 rankings (opcionalment filtrat per configuracio)
// POST /api/rankings - Guarda un nou ranking { nom, puntuacio, temps, configuracio }

export async function onRequestGet(context) {
  const { env, request } = context

  try {
    const url = new URL(request.url)
    const configuracio = url.searchParams.get('configuracio')

    let query, params

    if (configuracio) {
      query = 'SELECT nom, puntuacio, temps, data, configuracio FROM rankings WHERE configuracio = ? ORDER BY puntuacio DESC, temps ASC LIMIT 100'
      params = [configuracio]
    } else {
      query = 'SELECT nom, puntuacio, temps, data, configuracio FROM rankings ORDER BY puntuacio DESC, temps ASC LIMIT 100'
      params = []
    }

    const stmt = env.DB.prepare(query)
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()

    return Response.json(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return Response.json({ error: 'Error obtenint rankings' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export async function onRequestPost(context) {
  const { env, request } = context

  try {
    const { nom, puntuacio, temps, configuracio } = await request.json()

    // Validacions
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return Response.json({ error: 'El nom és obligatori' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    if (!puntuacio || typeof puntuacio !== 'number' || puntuacio < 1) {
      return Response.json({ error: 'Puntuació invàlida' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Temps en segons (opcional, per defecte 0)
    const tempsNet = typeof temps === 'number' && temps >= 0 ? Math.floor(temps) : 0

    const nomNet = nom.trim().slice(0, 50)

    // Configuració del tauler (obligatori)
    const configNet = (typeof configuracio === 'string' && configuracio.trim().length > 0)
      ? configuracio.trim().slice(0, 50)
      : 'classic_10x10'

    await env.DB.prepare(
      'INSERT INTO rankings (nom, puntuacio, temps, configuracio) VALUES (?, ?, ?, ?)'
    ).bind(nomNet, puntuacio, tempsNet, configNet).run()

    return Response.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return Response.json({ error: 'Error guardant ranking' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
