// API Cloudflare Pages Functions per als rankings
// GET /api/rankings - Retorna TOP 100 rankings
// POST /api/rankings - Guarda un nou ranking { nom, puntuacio, temps }

export async function onRequestGet(context) {
  const { env } = context

  try {
    const { results } = await env.DB.prepare(
      'SELECT nom, puntuacio, temps, data FROM rankings ORDER BY puntuacio DESC, temps ASC LIMIT 100'
    ).all()

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
    const { nom, puntuacio, temps } = await request.json()

    // Validacions
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return Response.json({ error: 'El nom és obligatori' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    if (!puntuacio || typeof puntuacio !== 'number' || puntuacio < 1 || puntuacio > 100) {
      return Response.json({ error: 'Puntuació invàlida (1-100)' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Temps en segons (opcional, per defecte 0)
    const tempsNet = typeof temps === 'number' && temps >= 0 ? Math.floor(temps) : 0

    const nomNet = nom.trim().slice(0, 50)

    await env.DB.prepare(
      'INSERT INTO rankings (nom, puntuacio, temps) VALUES (?, ?, ?)'
    ).bind(nomNet, puntuacio, tempsNet).run()

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
