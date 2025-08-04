import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type JudgementParticipant = {
  codeLetter: string
  mark: number
}

export default function useJudgementParticipants({
    eventId,
    itemId,
    judgeId,
}: {
    eventId: string
    itemId: string
    judgeId: string
}) {
  return useQuery({
    queryKey: [
      'judgement/participants',
      { eventId, itemId,judgeId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (eventId) params.eventId = eventId
      if (itemId) params.itemId = itemId
      if (judgeId) params.judgeId = judgeId

      const res = await api.get<{ data: JudgementParticipant[] }>(
        '/judgement/participants',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
