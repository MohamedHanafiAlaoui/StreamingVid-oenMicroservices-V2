import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getVideo } from '../api/videos'
import { addHistory } from '../api/users'

function extractYoutubeEmbedUrl(url) {
  if (!url) return ''

  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/embed/')) return url
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch {
    // ignore
  }

  return ''
}

export default function WatchPage() {
  const { id } = useParams()

  const defaultUserId = useMemo(() => localStorage.getItem('selectedUserId') || '', [])
  const [userId, setUserId] = useState(defaultUserId)

  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [progressTime, setProgressTime] = useState('')
  const [completed, setCompleted] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const embedUrl = useMemo(() => extractYoutubeEmbedUrl(video?.trailerUrl), [video?.trailerUrl])

  useEffect(() => {
    if (!id) return

    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getVideo(id)
        if (!cancelled) setVideo(data)
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

  async function markWatched() {
    setSaving(true)
    setError('')
    setSavedMsg('')

    try {
      const payload = {
        progressTime: progressTime === '' ? 0 : Number(progressTime),
        completed
      }
      await addHistory(userId, id, payload)
      setSavedMsg('Saved in history ✅')
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur enregistrement history')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="muted">Watch</div>
            <h2 style={{ marginTop: 6 }}>{loading ? 'Loading...' : video?.title ?? `Video #${id}`}</h2>
            <div className="muted" style={{ marginTop: 6 }}>
              This page records watch history in `user-service`.
            </div>
          </div>
          <div className="row">
            <Link className="btn secondary" to={`/videos/${id}`}>
              Details
            </Link>
            <Link className="btn secondary" to="/videos">
              Back
            </Link>
          </div>
        </div>

        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}
        {savedMsg ? <div style={{ marginTop: 10, color: '#86efac' }}>{savedMsg}</div> : null}

        <div className="grid" style={{ marginTop: 12 }}>
          <div className="grid grid-2">
            <div>
              <label>User ID</label>
              <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                Tip: select user in Profile page to auto-fill.
              </div>
            </div>

            <div>
              <label>Progress Time</label>
              <input className="input" value={progressTime} onChange={(e) => setProgressTime(e.target.value)} />
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                Use any number (backend stores it as units).
              </div>
            </div>

            <div className="row" style={{ alignItems: 'center' }}>
              <input
                id="completed"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <label htmlFor="completed" style={{ margin: 0 }}>
                Completed
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button className="btn" onClick={markWatched} disabled={!userId || saving}>
                {saving ? 'Saving...' : 'Save to history'}
              </button>
            </div>
          </div>

          {embedUrl ? (
            <div style={{ marginTop: 12 }}>
              <div className="muted">Trailer</div>
              <div style={{ marginTop: 10, position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title="Trailer"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    borderRadius: 14
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : video?.trailerUrl ? (
            <div style={{ marginTop: 12 }}>
              <div className="muted">Trailer URL</div>
              <div style={{ marginTop: 6, wordBreak: 'break-all' }}>{video.trailerUrl}</div>
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                If it's a YouTube link, use an embed URL or a youtu.be link.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
