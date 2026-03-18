import React, { useState } from 'react'
import { addToWatchlist, listWatchlist, removeFromWatchlist } from '../api/users'

export default function WatchlistPage() {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState([])
  const [videoId, setVideoId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchList() {
    setError('')
    setLoading(true)
    try {
      const data = await listWatchlist(userId)
      setItems(Array.isArray(data) ? data : data?.content || [])
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur watchlist')
    } finally {
      setLoading(false)
    }
  }

  async function add(e) {
    e.preventDefault()
    setError('')
    try {
      await addToWatchlist(userId, videoId)
      setVideoId('')
      await fetchList()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Erreur ajout watchlist')
    }
  }

  async function remove(item) {
    setError('')
    try {
      await removeFromWatchlist(userId, item.videoId)
      await fetchList()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Erreur suppression watchlist')
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Watchlist</h2>
        <div className="muted">Charger la watchlist par userId</div>

        <div className="row" style={{ marginTop: 10 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label>User ID</label>
            <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button className="btn" onClick={fetchList} disabled={!userId || loading}>
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>

        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}

        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Video ID</th>
                <th>Added At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>{w.videoId}</td>
                  <td className="muted">{w.addedAt}</td>
                  <td>
                    <button className="btn" onClick={() => remove(w)} disabled={!userId}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Add to Watchlist</h2>
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
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn" type="submit" disabled={!userId || !videoId}>
                Add
              </button>
              <button className="btn secondary" type="button" onClick={() => setVideoId('')}>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
