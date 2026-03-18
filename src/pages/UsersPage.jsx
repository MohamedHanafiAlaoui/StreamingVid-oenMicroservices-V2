import React, { useEffect, useState } from 'react'
import { createUser, deleteUser, listUsers, updateUser } from '../api/users'

const initialForm = {
  username: '',
  email: '',
  password: ''
}

export default function UsersPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listUsers()
      setItems(Array.isArray(data) ? data : data?.content || [])
    } catch (e) {
      setError(e?.message || 'Erreur chargement users')
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

  function startEdit(u) {
    setEditingId(String(u.id))
    setForm({
      username: u.username ?? '',
      email: u.email ?? '',
      password: ''
    })
  }

  function reset() {
    setEditingId('')
    setForm(initialForm)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        const payload = { username: form.username, email: form.email }
        if (form.password) payload.password = form.password
        await updateUser(editingId, payload)
      } else {
        await createUser(form)
      }
      reset()
      await refresh()
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Erreur submit user')
    }
  }

  async function remove(id) {
    setError('')
    try {
      await deleteUser(id)
      await refresh()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Erreur suppression user')
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Users</h2>
        <div className="muted">{loading ? 'Chargement...' : `${items.length} item(s)`}</div>
        {error ? <div style={{ marginTop: 10, color: '#fca5a5' }}>{error}</div> : null}

        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <div className="row">
                      <button className="btn secondary" onClick={() => startEdit(u)}>
                        Edit
                      </button>
                      <button className="btn" onClick={() => remove(u.id)}>
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
        <h2>{editingId ? `Edit User #${editingId}` : 'Create User'}</h2>
        <form onSubmit={submit}>
          <div className="grid" style={{ marginTop: 10 }}>
            <div>
              <label>Username</label>
              <input className="input" value={form.username} onChange={(e) => onChange('username', e.target.value)} />
            </div>
            <div>
              <label>Email</label>
              <input className="input" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
            </div>
            <div>
              <label>Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} />
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
