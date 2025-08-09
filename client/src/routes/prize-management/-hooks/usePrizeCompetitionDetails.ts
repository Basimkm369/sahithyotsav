import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type CompetitionDetails = {
  participants: {
    chestNumber: number
    name: string
    teamName: string
    codeLetter: string
    grade: string
    rank: number
    momentoDistributed: boolean
    cashDistributed: boolean
  }[]
}

export default function usePrizeCompetitionDetails({
  itemId,
  eventId,
}: {
  itemId?: number
  eventId: string
}) {
  return useQuery({
    queryKey: ['prizeManagement', 'competitions', { itemId, eventId }],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: CompetitionDetails }>(
        `/prizeManagement/competitions/${itemId}`,
        { params },
      )
      return res.data?.data ?? null
    },
    enabled: !!itemId,
    refetchInterval: 5 * 1000,
  })
}
