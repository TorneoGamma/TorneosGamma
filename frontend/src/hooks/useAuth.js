import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => api.post('/login', data).then((r) => r.data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate(user.role === 'admin' ? '/admin' : '/')
    },
  })
}

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => api.post('/register', data).then((r) => r.data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate('/')
    },
  })
}

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return () => {
    api.post('/logout').finally(() => {
      logout()
      navigate('/login')
    })
  }
}
