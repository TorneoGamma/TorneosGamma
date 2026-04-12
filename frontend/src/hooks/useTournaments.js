import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'

export const useTournaments = (params = {}) =>
  useQuery({
    queryKey: ['tournaments', params],
    queryFn: () => api.get('/tournaments', { params }).then((r) => r.data),
  })

export const useTournament = (id) =>
  useQuery({
    queryKey: ['tournament', id],
    queryFn: () => api.get(`/tournaments/${id}`).then((r) => r.data),
    enabled: !!id,
  })

export const useCreateTournament = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/tournaments', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tournaments'] }),
  })
}

export const useDeleteTournament = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/tournaments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tournaments'] }),
  })
}

export const useGenerateBracket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/tournaments/${id}/bracket/generate`).then((r) => r.data),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ['tournament', id] }),
  })
}

export const useRecordResult = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ matchId, ...data }) =>
      api.post(`/matches/${matchId}/result`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tournament'] })
    },
  })
}

export const useRegisterTeam = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tournamentId, ...data }) =>
      api.post(`/tournaments/${tournamentId}/teams`, data).then((r) => r.data),
    onSuccess: (_, { tournamentId }) =>
      qc.invalidateQueries({ queryKey: ['tournament', String(tournamentId)] }),
  })
}

export const useReports = () =>
  useQuery({
    queryKey: ['reports-general'],
    queryFn: () => api.get('/reports/general').then((r) => r.data),
  })

export const useTournamentReport = (id) =>
  useQuery({
    queryKey: ['report-tournament', id],
    queryFn: () => api.get(`/reports/tournament/${id}`).then((r) => r.data),
    enabled: !!id,
  })
