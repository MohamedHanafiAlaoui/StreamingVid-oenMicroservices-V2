import { http } from './http'

export async function listUsers() {
  const { data } = await http.get('/api/users')
  return data
}

export async function getUser(id) {
  const { data } = await http.get(`/api/users/${id}`)
  return data
}

export async function createUser(payload) {
  const { data } = await http.post('/api/users', payload)
  return data
}

export async function updateUser(id, payload) {
  const { data } = await http.put(`/api/users/${id}`, payload)
  return data
}

export async function deleteUser(id) {
  await http.delete(`/api/users/${id}`)
}

export async function listWatchlist(userId) {
  const { data } = await http.get(`/api/watchlist/user/${userId}`)
  return data
}

export async function addToWatchlist(userId, videoId) {
  const { data } = await http.post(`/api/watchlist/user/${userId}/video/${videoId}`)
  return data
}

export async function removeFromWatchlist(userId, videoId) {
  await http.delete(`/api/watchlist/user/${userId}/video/${videoId}`)
}

export async function listHistory(userId) {
  const { data } = await http.get(`/api/history/user/${userId}`)
  return data
}

export async function addHistory(userId, videoId, payload) {
  const { data } = await http.post(`/api/history/user/${userId}/video/${videoId}`, payload)
  return data
}

export async function getStats(userId) {
  const { data } = await http.get(`/api/history/user/${userId}/stats`)
  return data
}
