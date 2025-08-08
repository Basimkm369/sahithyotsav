import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Participant = {
  chestNumber: number
  name: string
  categoryName: string
  competitions: {
    itemName: string
    participantStatus: string
    codeLetter: string
    status: string
    rank: number
  }[]
  totalCount: number
}

export default function useTeamParticipants({
  eventId,
  teamId,
  categoryId,
  page,
  limit = 30,
}: {
  eventId: string
  teamId: string
  categoryId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'teamManagement/participants',
      { categoryId, page, limit, eventId, teamId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId
      if (teamId) params.teamId = teamId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Participant[] }>(
        '/teamManagement/participants',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
