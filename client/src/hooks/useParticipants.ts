import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Route } from '@/routes/team-management'

export type Participant = {
  chestNumber: number
  name: string
  categoryName: string
  competitions: {
    itemName: string
    participantStatus: string
    competitionStatus: string
  }[]
  totalCount: number
}

export function useParticipants({
  categoryId,
  page,
  limit = 10,
}: {
  categoryId: string
  page: number
  limit?: number
}) {
  const { eventId, teamId } = Route.useSearch()

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
    staleTime: 5 * 1000,
  })
}
