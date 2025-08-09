import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  itemCode: number
  stageName: string
  name: string
  categoryName: string
  status: string
  totalCount: number
  date: string
  startTime: string
  endTime: string
}

export default function usePrizeCompetitions({
  eventId,
  status,
  page,
  limit = 24,
}: {
  eventId: string
  status: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'prizeManagement',
      'competitions',
      { status, page, limit, eventId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (status !== 'all') params.status = status
      if (eventId) params.eventId = eventId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Competition[] }>(
        '/prizeManagement/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
