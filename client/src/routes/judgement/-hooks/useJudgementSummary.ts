import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type JudgementSummary = {
  judgeName: string
  itemName: string
  categoryName: string
  scores: {
    codeLetter: string
    mark: number
  }[]
}

export default function useJudgementSummary({
  eventId,
  itemId,
  judgeId,
}: {
  eventId: string
  itemId: string
  judgeId: string
}) {
  return useQuery({
    queryKey: ['judgement', { eventId, itemId, judgeId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId
      if (itemId) params.itemId = itemId
      if (judgeId) params.judgeId = judgeId

      const res = await api.get<{ data: JudgementSummary }>('/judgement', {
        params,
      })
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
