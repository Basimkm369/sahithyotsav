import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type AdminSummary = {
  categories: {
    name: string
    number: number
  }[]
  stages: { competitionsCount: number; name: string; number: string }[]
  teams: { name: string; number: string }[]
}

export default function useAdminSummary({ eventId }: { eventId: string }) {
  return useQuery({
    queryKey: ['admin', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: AdminSummary }>('/admin', {
        params,
      })
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
