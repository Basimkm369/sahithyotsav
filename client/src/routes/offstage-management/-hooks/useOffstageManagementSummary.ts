import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type OffstageManagementSummary = {
  stages: { name: string; number: string }[]
  categories: {
    name: string
    number: number
  }[]
}

export default function useOffstageManagementSummary({
  eventId,
}: {
  eventId: string
}) {
  return useQuery({
    queryKey: ['offstageManagement', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: OffstageManagementSummary }>(
        '/offstageManagement',
        { params },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
