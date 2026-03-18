import React, { useEffect, useMemo, useState } from 'react'
import { listUsers, listWatchlist, listHistory, getStats } from '../api/users'

function StatCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <div className="value">{value}</div>
      {subtitle ? <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{subtitle}</div> : null}
    </div>
  )
}

export default function ProfilePage() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')

  const [watchlist, setWatchlist] = useState([])
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)

  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [error, setError] = useState('')

  const selectedUser = useMemo(
    () => users.find((u) => String(u.id) === String(userId)),
    [users, userId]
  )

  async function loadUsers() {
    setLoadingUsers(true)
    setError('')
    try {
      const data = await listUsers()
      const list = Array.isArray(data) ? data : data?.content || []
      setUsers(list)
      if (!userId && list.length) setUserId(String(list[0].id))
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur chargement users')
    } finally {
      setLoadingUsers(false)
    }
  }

  async function loadProfile(id) {
    if (!id) return
    setLoadingProfile(true)
    setError('')
    try {
      const [w, h, s] = await Promise.all([listWatchlist(id), listHistory(id), getStats(id)])
      setWatchlist(Array.isArray(w) ? w : w?.content || [])
      setHistory(Array.isArray(h) ? h : h?.content || [])
      setStats(s)
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur chargement profil')
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userId) loadProfile(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (userId) localStorage.setItem('selectedUserId', String(userId))
  }, [userId])

  return (
    <div className="grid">
      <div className="card" style={{
        padding: 0,
        overflow: 'hidden',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)'
      }}>
        <div style={{
          padding: 18,
          background: 'linear-gradient(135deg, rgba(229,9,20,0.25), rgba(99,102,241,0.18), rgba(0,0,0,0))'
        }}>
          <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="muted">User profile</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                {selectedUser?.username ?? (loadingUsers ? 'Loading...' : 'Select a user')}
              </div>
              <div className="muted" style={{ marginTop: 6 }}>
                {selectedUser?.email ?? ''}
              </div>
            </div>

            <div style={{ minWidth: 280 }}>
              <label>Choose user</label>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} disabled={loadingUsers}>
                <option value="">-- select --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} (#{u.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            {loadingProfile ? 'Loading profile...' : 'Watchlist, history and stats from user-service'}
          </div>

          {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}
        </div>
      </div>

      <div className="kpi">
        <StatCard title="Total watched" value={stats?.totalVideosWatched ?? '-'} />
        <StatCard title="Completed" value={stats?.completedVideos ?? '-'} />
        <StatCard title="Watch time" value={stats?.totalWatchTime ?? '-'} subtitle="units = progressTime" />
      </div>

      <div className="kpi">
        <StatCard
          title="Avg completion"
          value={stats?.averageCompletionRate == null ? '-' : `${Number(stats.averageCompletionRate).toFixed(1)}%`}
        />
        <StatCard title="Watchlist" value={watchlist.length} />
        <StatCard title="History items" value={history.length} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>My List</h2>
          <div className="muted">Watchlist items</div>
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Video</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w) => (
                  <tr key={w.id}>
                    <td>{w.id}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>#{w.videoId}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {w.video?.title ?? ''}
                      </div>
                    </td>
                    <td className="muted">{w.addedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Continue watching</h2>
          <div className="muted">History items</div>
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Video</th>
                  <th>Progress</th>
                  <th>Completed</th>
                  <th>Watched</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>#{h.videoId}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {h.video?.title ?? ''}
                      </div>
                    </td>
                    <td>{h.progressTime ?? 0}</td>
                    <td>{String(h.completed)}</td>
                    <td className="muted">{h.watchedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
