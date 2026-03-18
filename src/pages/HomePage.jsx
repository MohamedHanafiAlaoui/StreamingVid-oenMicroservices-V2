import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/http'
import { listVideos } from '../api/videos'

export default function HomePage() {
  const baseUrl = useMemo(() => API_BASE_URL, [])

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hero = useMemo(() => {
    if (!items.length) return null
    return items[Math.floor(Math.random() * items.length)]
  }, [items])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await listVideos()
        const list = Array.isArray(data) ? data : data?.content || []
        if (!cancelled) setItems(list)
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || 'Erreur chargement videos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid">
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.10)'
        }}
      >
        <div
          style={{
            padding: 18,
            background:
              'linear-gradient(135deg, rgba(229,9,20,0.24), rgba(99,102,241,0.16), rgba(0,0,0,0))'
          }}
        >
          <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="muted">Streaming</div>
              <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>Welcome back</div>
              <div className="muted" style={{ marginTop: 6 }}>
                {loading ? 'Loading catalog…' : `${items.length} video(s) available`}
              </div>
              {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}
            </div>

            <div style={{ minWidth: 320 }}>
              <div className="muted">API base</div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                }}
              >
                {baseUrl || '(Vite proxy: same origin)'}
              </div>
            </div>
          </div>

          {hero ? (
            <div className="grid grid-2" style={{ marginTop: 14, alignItems: 'center' }}>
              <div>
                <div className="muted">Featured</div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{hero.title}</div>
                <div className="muted" style={{ marginTop: 8, lineHeight: 1.5 }}>
                  {hero.description}
                </div>
                <div className="row" style={{ marginTop: 14 }}>
                  <Link className="btn" to={`/watch/${hero.id}`}>
                    Watch
                  </Link>
                  <Link className="btn secondary" to={`/videos/${hero.id}`}>
                    Details
                  </Link>
                  <Link className="btn secondary" to="/videos">
                    Browse
                  </Link>
                </div>
              </div>

              <div>
                {hero.thumbnailUrl ? (
                  <img
                    src={hero.thumbnailUrl}
                    alt={hero.title}
                    style={{
                      width: '100%',
                      maxHeight: 320,
                      objectFit: 'cover',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.12)'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 260,
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0 }}>Trending now</h2>
            <div className="muted" style={{ marginTop: 6 }}>
              Click a card to view details or watch
            </div>
          </div>
          <Link className="btn secondary" to="/videos">
            Manage videos
          </Link>
        </div>

        <div
          style={{
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12
          }}
        >
          {items.slice(0, 12).map((v) => (
            <div
              key={v.id}
              className="card"
              style={{
                padding: 12,
                cursor: 'pointer',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <Link to={`/videos/${v.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {v.thumbnailUrl ? (
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.10)'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.04)'
                    }}
                  />
                )}

                <div style={{ marginTop: 10, fontWeight: 900 }}>{v.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {v.type} • {v.category} • {v.releaseYear}
                </div>
              </Link>

              <div className="row" style={{ marginTop: 10 }}>
                <Link className="btn" to={`/watch/${v.id}`}>
                  Watch
                </Link>
                <Link className="btn secondary" to={`/videos/${v.id}`}>
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
