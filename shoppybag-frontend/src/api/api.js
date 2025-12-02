import axios from 'axios'

export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_HOST + '/api',
  withCredentials: false,
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if(t) cfg.headers = { ...(cfg.headers||{}), Authorization: `Bearer ${t}` }
  return cfg
})

export default api
