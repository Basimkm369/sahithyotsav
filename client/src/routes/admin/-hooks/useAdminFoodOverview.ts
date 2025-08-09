import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type AdminFoodOverview = {
  hourSlot: string
  type: string
  count: number
}[]

export default function useAdminFoodOverview({
  eventId,
  date,
  type,
}: {
  eventId: string
  date: string
  type: string
}) {
  return useQuery({
    queryKey: ['admin', 'food', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId
      if (date) params.date = date
      if (type) params.type = type

      const res = await api.get<{ data: AdminFoodOverview }>('/admin/food', {
        params,
      })
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
