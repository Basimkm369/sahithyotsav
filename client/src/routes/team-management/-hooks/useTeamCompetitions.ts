import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  id: number
  name: string
  stageName: string
  categoryName: string
  status: string
  participants: {
    name: string
    chestNumber: string
    codeLetter: string
    status: string
    rank: number
  }[]
  totalCount: number
  date: string
  startTime: string
  endTime: string
}

export default function useTeamCompetitions({
  eventId,
  teamId,
  status,
  stageId,
  categoryId,
  page,
  limit = 24,
}: {
  eventId: string
  teamId: string
  status: string
  stageId: string
  categoryId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'teamManagement/competitions',
      { status, stageId, categoryId, page, limit, eventId, teamId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (status !== 'all') params.status = status
      if (stageId !== 'all') params.stageId = stageId
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId
      if (teamId) params.teamId = teamId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Competition[] }>(
        '/teamManagement/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
