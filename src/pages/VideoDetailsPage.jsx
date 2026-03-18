import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getVideo } from '../api/videos'

export default function VideoDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getVideo(id)
        if (!cancelled) setItem(data)
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || 'Erreur chargement video')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="muted">Video details</div>
            <h2 style={{ marginTop: 6 }}>{loading ? 'Loading...' : item?.title ?? `#${id}`}</h2>
          </div>
          <div className="row">
            <Link className="btn secondary" to="/videos">
              Back
            </Link>
            <Link className="btn" to={`/watch/${id}`}>
              Watch
            </Link>
          </div>
        </div>

        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}

        {item ? (
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="grid grid-2">
              <div>
                <div className="muted">Type</div>
                <div style={{ fontWeight: 700 }}>{item.type}</div>
              </div>
              <div>
                <div className="muted">Category</div>
                <div style={{ fontWeight: 700 }}>{item.category}</div>
              </div>
              <div>
                <div className="muted">Release year</div>
                <div style={{ fontWeight: 700 }}>{item.releaseYear}</div>
              </div>
              <div>
                <div className="muted">Duration</div>
                <div style={{ fontWeight: 700 }}>{item.duration}</div>
              </div>
            </div>

            <div>
              <div className="muted">Description</div>
              <div style={{ marginTop: 6, lineHeight: 1.5 }}>{item.description}</div>
            </div>

            <div className="grid grid-2">
              <div>
                <div className="muted">Director</div>
                <div style={{ fontWeight: 700 }}>{item.director}</div>
              </div>
              <div>
                <div className="muted">Rating</div>
                <div style={{ fontWeight: 700 }}>{item.rating}</div>
              </div>
            </div>

            <div>
              <div className="muted">Cast</div>
              <div style={{ marginTop: 6 }}>{item.cast}</div>
            </div>

            {item.thumbnailUrl ? (
              <div>
                <div className="muted">Thumbnail</div>
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  style={{ marginTop: 10, maxWidth: '100%', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
            ) : null}

            {item.trailerUrl ? (
              <div>
                <div className="muted">Trailer URL</div>
                <div style={{ marginTop: 6, wordBreak: 'break-all' }}>{item.trailerUrl}</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
