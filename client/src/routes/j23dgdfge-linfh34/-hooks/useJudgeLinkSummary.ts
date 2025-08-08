import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type JudgeLinkSummary = {
  categories: {
    name: string
    number: string
  }[]
}

export default function useJudgeLinkSummary({
  eventId,
}: {
  eventId: string
}) {
  return useQuery({
    queryKey: ['judgeLinks', { eventId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId

      const res = await api.get<{ data: JudgeLinkSummary }>(
        '/judgeLinks',
        {
          params,
        },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
