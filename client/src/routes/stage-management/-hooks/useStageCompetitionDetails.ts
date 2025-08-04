import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type CompetitionDetails = {
  participants: {
    chestNumber: number
    name: string
    teamName: string
    codeLetter: string
    status: string
  }[]
}

export default function useStageCompetitionDetails({
  itemId,
  eventId,
  stageId,
}: {
  itemId?: number
  eventId: string
  stageId: string
}) {
  return useQuery({
    queryKey: ['stageManagement/competitions', { itemId, eventId, stageId }],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId
      if (stageId) params.stageId = stageId

      const res = await api.get<{ data: CompetitionDetails }>(
        `/stageManagement/competitions/${itemId}`,
        { params },
      )
      return res.data?.data ?? null
    },
    enabled: !!itemId,
    refetchInterval: 5 * 1000,
  })
}
