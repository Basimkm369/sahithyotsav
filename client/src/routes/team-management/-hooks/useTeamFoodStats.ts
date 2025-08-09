import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Participant = {
  chestNumber: number
  name: string
  categoryName: string
  status: number
}

export default function useTeamFoodStats({
  eventId,
  teamId,
  categoryId,
  status,
  type,
  date,
  page,
  limit = 30,
}: {
  eventId: string
  teamId: string
  categoryId: string
  status: string
  type: string
  date: string
  page: number
  limit?: number
}) {
  return useQuery({
    queryKey: [
      'teamManagement/foodStats',
      { categoryId, page, limit, eventId, teamId,type,date,status },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (categoryId !== 'all') params.categoryId = categoryId
      if (status !== 'all') params.status = status
      if (eventId) params.eventId = eventId
      if (teamId) params.teamId = teamId
      if (type) params.type = type
      if (date) params.date = date
      params.page = page
      params.limit = limit

      const res = await api.get<{ data: Participant[] }>(
        '/teamManagement/foodStats',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
