import { http } from './http'

export async function listVideos() {
  const { data } = await http.get('/api/videos')
  return data
}

export async function getVideo(id) {
  const { data } = await http.get(`/api/videos/${id}`)
  return data
}

export async function createVideo(payload) {
  const { data } = await http.post('/api/videos', payload)
  return data
}

export async function updateVideo(id, payload) {
  const { data } = await http.put(`/api/videos/${id}`, payload)
  return data
}

export async function deleteVideo(id) {
  await http.delete(`/api/videos/${id}`)
}
