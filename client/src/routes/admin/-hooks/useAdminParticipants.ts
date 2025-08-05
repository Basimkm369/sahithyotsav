import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Participant = {
  chestNumber: number
  name: string
  categoryName: string
  teamName: string
  competitions: {
    itemName: string
    participantStatus: string
    status: string
    rank: number
  }[]
  totalCount: number
}

export default function useAdminParticipants({
  eventId,
  categoryId,
  teamId,
  page,
  limit = 30,
}: {
  eventId: string
  categoryId: string
  teamId: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'admin',
      'participants',
      { categoryId, teamId, page, limit, eventId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (categoryId !== 'all') params.categoryId = categoryId
      if (teamId !== 'all') params.teamId = teamId
      if (eventId) params.eventId = eventId
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Participant[] }>(
        '/admin/participants',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
