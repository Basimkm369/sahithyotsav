import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type CompetitionDetails = {
  participants: {
    chestNumber: number
    name: string
    teamName: string
    codeLetter: string
    categoryName: string
    mark: string
    grade: string
    prize: string
    status: string
  }[]
}

export default function useMediaCompetitionDetails({
  itemId,
  eventId,
}: {
  itemId?: number
  eventId: string
}) {
  return useQuery({
    queryKey: ['mediaControl', 'competitions', { itemId, eventId }],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: CompetitionDetails }>(
        `/mediaControl/competitions/${itemId}`,
        { params },
      )
      return res.data?.data ?? null
    },
    enabled: !!itemId,
    refetchInterval: 5 * 1000,
  })
}
