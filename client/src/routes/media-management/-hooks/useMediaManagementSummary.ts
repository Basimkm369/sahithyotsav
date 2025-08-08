import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type MediaManagementSummary = {
  stages: { name: string; number: string }[]
  categories: {
    name: string
    number: string
  }[]
}

export default function useMediaManagementSummary({
  eventId,
}: {
  eventId: string
}) {
  return useQuery({
    queryKey: ['mediaManagement', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: MediaManagementSummary }>(
        '/mediaManagement',
        { params },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
