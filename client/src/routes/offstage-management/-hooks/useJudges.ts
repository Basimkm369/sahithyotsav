import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Judge = {
  id: string
  name: string
}

export default function useJudges({ eventId }: { eventId: string }) {
  return useQuery({
    queryKey: ['admin', 'judges', { eventId }],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: Judge[] }>('/admin/judges', { params })
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
