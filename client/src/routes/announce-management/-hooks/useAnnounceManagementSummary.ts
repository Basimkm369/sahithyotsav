import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type AnnounceManagementSummary = {
  stages: { name: string; number: string }[]
  categories: {
    name: string
    number: string
  }[]
}

export default function useAnnounceManagementSummary({
  eventId,
}: {
  eventId: string
}) {
  return useQuery({
    queryKey: ['announceManagement', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: AnnounceManagementSummary }>(
        '/announceManagement',
        { params },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
