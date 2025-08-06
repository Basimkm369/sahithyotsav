import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  itemCode: number
  name: string
  stageType: string
  categoryName: string
  status: string
  totalCount: number
  date: string
  startTime: string
  endTime: string
  judge1Name: string
  judge2Name: string
  judge3Name: string
  judge1Submitted: boolean
  judge2Submitted: boolean
  judge3Submitted: boolean
}

export default function useStageCompetitions({
  eventId,
  stageId,
  status,
  categoryId,
  page,
  limit = 24,
}: {
  eventId: string
  stageId: string
  status: string
  categoryId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'stageManagement',
      'competitions',
      { status, categoryId, page, limit, eventId, stageId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (status !== 'all') params.status = status
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId
      if (stageId) params.stageId = stageId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Competition[] }>(
        '/stageManagement/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
