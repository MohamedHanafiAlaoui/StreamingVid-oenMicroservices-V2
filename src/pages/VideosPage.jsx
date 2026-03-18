import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createVideo, deleteVideo, listVideos, updateVideo } from '../api/videos'

const initialForm = {
  title: '',
  description: '',
  thumbnailUrl: '',
  trailerUrl: '',
  duration: '',
  releaseYear: '',
  type: 'FILM',
  category: 'ACTION',
  rating: '',
  director: '',
  cast: ''
}

export default function VideosPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')

  const types = useMemo(() => ['FILM', 'SERIE'], [])
  const categories = useMemo(
    () => ['ACTION', 'COMEDIE', 'DRAME', 'SCIENCE_FICTION', 'THRILLER', 'HORREUR'],
    []
  )

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listVideos()
      setItems(Array.isArray(data) ? data : data?.content || [])
    } catch (e) {
      setError(e?.message || 'Erreur chargement videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function onChange(key, value) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function startEdit(v) {
    setEditingId(String(v.id))
    setForm({
      title: v.title ?? '',
      description: v.description ?? '',
      thumbnailUrl: v.thumbnailUrl ?? '',
      trailerUrl: v.trailerUrl ?? '',
      duration: v.duration ?? '',
      releaseYear: v.releaseYear ?? '',
      type: v.type ?? 'FILM',
      category: v.category ?? 'ACTION',
      rating: v.rating ?? '',
      director: v.director ?? '',
      cast: Array.isArray(v.cast) ? v.cast.join(', ') : v.cast ?? ''
    })
  }

  function reset() {
    setEditingId('')
    setForm(initialForm)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      ...form,
      duration: form.duration === '' ? null : Number(form.duration),
      releaseYear: form.releaseYear === '' ? null : Number(form.releaseYear),
      rating: form.rating === '' ? null : Number(form.rating),
      cast: form.cast
    }

    try {
      if (editingId) {
        await updateVideo(editingId, payload)
      } else {
        await createVideo(payload)
      }
      reset()
      await refresh()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Erreur submit video')
    }
  }

  async function remove(id) {
    setError('')
    try {
      await deleteVideo(id)
      await refresh()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur suppression video')
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Videos</h2>
        <div className="muted">{loading ? 'Chargement...' : `${items.length} item(s)`}</div>
        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}

        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Catégorie</th>
                <th>Année</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{v.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {v.trailerUrl}
                    </div>
                  </td>
                  <td>{v.type}</td>
                  <td>{v.category}</td>
                  <td>{v.releaseYear}</td>
                  <td>
                    <div className="row">
                      <Link className="btn secondary" to={`/videos/${v.id}`}>
                        Details
                      </Link>
                      <Link className="btn secondary" to={`/watch/${v.id}`}>
                        Watch
                      </Link>
                      <button className="btn secondary" onClick={() => startEdit(v)}>
                        Edit
                      </button>
                      <button className="btn" onClick={() => remove(v.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? `Edit Video #${editingId}` : 'Create Video'}</h2>
        <form onSubmit={submit}>
          <div className="grid" style={{ marginTop: 10 }}>
            <div>
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => onChange('title', e.target.value)} />
            </div>

            <div>
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => onChange('description', e.target.value)} rows={3} />
            </div>

            <div>
              <label>Thumbnail URL</label>
              <input className="input" value={form.thumbnailUrl} onChange={(e) => onChange('thumbnailUrl', e.target.value)} />
            </div>

            <div>
              <label>YouTube Trailer URL (embed)</label>
              <input className="input" value={form.trailerUrl} onChange={(e) => onChange('trailerUrl', e.target.value)} />
            </div>

            <div className="row">
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Duration (min)</label>
                <input className="input" value={form.duration} onChange={(e) => onChange('duration', e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Release Year</label>
                <input className="input" value={form.releaseYear} onChange={(e) => onChange('releaseYear', e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Type</label>
                <select value={form.type} onChange={(e) => onChange('type', e.target.value)}>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Category</label>
                <select value={form.category} onChange={(e) => onChange('category', e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Rating</label>
                <input className="input" value={form.rating} onChange={(e) => onChange('rating', e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label>Director</label>
                <input className="input" value={form.director} onChange={(e) => onChange('director', e.target.value)} />
              </div>
            </div>

            <div>
              <label>Cast (comma separated)</label>
              <input className="input" value={form.cast} onChange={(e) => onChange('cast', e.target.value)} />
            </div>

            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn" type="submit">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button className="btn secondary" type="button" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
