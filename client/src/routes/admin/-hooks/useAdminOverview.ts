import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CompetitionStatus from '@/constants/CompetitionStatus'

export type AdminOverview = {
  countByStatus: {
    count: number
    status: CompetitionStatus
  }[]
}

export default function useAdminOverview({ eventId }: { eventId: string }) {
  return useQuery({
    queryKey: ['admin', 'overview', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: AdminOverview }>('/admin/overview', {
        params,
      })
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
