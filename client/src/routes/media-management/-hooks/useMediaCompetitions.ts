import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  itemCode: number
  stageName: string
  name: string
  categoryName: string
  status: string
  resultNumber: number
  totalCount: number
  date: string
  startTime: string
  endTime: string
}

export default function useMediaCompetitions({
  eventId,
  stageId,
  categoryId,
  page,
  limit = 24,
}: {
  eventId: string
  stageId: string
  categoryId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'mediaManagement',
      'competitions',
      { page, limit, eventId, stageId, categoryId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId
      if (stageId !== 'all') params.stageId = stageId
      if (categoryId !== 'all') params.categoryId = categoryId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Competition[] }>(
        '/mediaManagement/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
