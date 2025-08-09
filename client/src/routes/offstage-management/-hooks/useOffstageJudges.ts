import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  id: number
  itemCode: number
  name: string
  stageName: string
  categoryName: string
  status: string
  participants: {
    name: string
    chestNumber: string
    status: string
    rank: number
  }[]
  totalCount: number
  date: string
  startTime: string
  endTime: string
  judge1Name: string
  judge2Name: string
  judge3Name: string
  judge1Id: string
  judge2Id: string
  judge3Id: string
}

export default function useOffstageJudges({
  eventId,
  status,
  stageId,
  categoryId,
  page,
  limit = 24,
}: {
  eventId: string
  status: string
  stageId: string
  categoryId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'admin',
      'competitions',
      { status, stageId, categoryId, page, limit, eventId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (status !== 'all') params.status = status
      if (stageId !== 'all') params.stageId = stageId
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Competition[] }>(
        '/admin/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
