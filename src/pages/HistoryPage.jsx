import React, { useState } from 'react'
import { addHistory, getStats, listHistory } from '../api/users'

export default function HistoryPage() {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [videoId, setVideoId] = useState('')
  const [progressTime, setProgressTime] = useState('')
  const [completed, setCompleted] = useState(false)

  async function fetchAll() {
    setError('')
    setLoading(true)
    try {
      const [historyData, statsData] = await Promise.all([listHistory(userId), getStats(userId)])
      setItems(Array.isArray(historyData) ? historyData : historyData?.content || [])
      setStats(statsData)
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur history/stats')
    } finally {
      setLoading(false)
    }
  }

  async function add(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        progressTime: progressTime === '' ? null : Number(progressTime),
        completed
      }
      await addHistory(userId, videoId, payload)
      setVideoId('')
      setProgressTime('')
      setCompleted(false)
      await fetchAll()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Erreur ajout history')
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>History & Stats</h2>
        <div className="row" style={{ marginTop: 10 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label>User ID</label>
            <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button className="btn" onClick={fetchAll} disabled={!userId || loading}>
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>

        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}

        <div style={{ marginTop: 12 }} className="kpi">
          <div className="card">
            <div className="muted">Total watched</div>
            <div className="value">{stats?.totalVideosWatched ?? '-'}</div>
          </div>
          <div className="card">
            <div className="muted">Completed</div>
            <div className="value">{stats?.completedVideos ?? '-'}</div>
          </div>
          <div className="card">
            <div className="muted">Total time</div>
            <div className="value">{stats?.totalWatchTime ?? '-'}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="kpi">
          <div className="card">
            <div className="muted">Avg completion</div>
            <div className="value">{stats?.averageCompletionRate == null ? '-' : `${Number(stats.averageCompletionRate).toFixed(1)}%`}</div>
          </div>
          <div className="card">
            <div className="muted">User</div>
            <div className="value">{stats?.username ?? '-'}</div>
          </div>
          <div className="card">
            <div className="muted">User ID</div>
            <div className="value">{stats?.userId ?? '-'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>History items</h2>
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Video ID</th>
                  <th>Watched At</th>
                  <th>Progress</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {items.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.videoId}</td>
                    <td className="muted">{h.watchedAt}</td>
                    <td>{h.progressTime}</td>
                    <td>{String(h.completed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Add history</h2>
          <form onSubmit={add}>
            <div className="grid" style={{ marginTop: 10 }}>
              <div>
                <label>User ID</label>
                <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
              </div>
              <div>
                <label>Video ID</label>
                <input className="input" value={videoId} onChange={(e) => setVideoId(e.target.value)} />
              </div>
              <div>
                <label>Progress Time</label>
                <input className="input" value={progressTime} onChange={(e) => setProgressTime(e.target.value)} />
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

              <div className="row" style={{ marginTop: 6 }}>
                <button className="btn" type="submit" disabled={!userId || !videoId}>
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
