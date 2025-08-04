import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type StageManagementSummary = {
  stageName: string
  categories: {
    name: string
    number: number
  }[]
}

export default function useStageManagementSummary({
  eventId,
  stageId,
}: {
  eventId: string
  stageId: string
}) {
  return useQuery({
    queryKey: ['stageManagement', { eventId, stageId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId
      if (stageId) params.stageId = stageId

      const res = await api.get<{ data: StageManagementSummary }>(
        '/stageManagement',
        { params },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
