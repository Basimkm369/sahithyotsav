import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Competition = {
  id: number
  itemCode: number
  name: string
  status: string
  date: string
  startTime: string
  endTime: string
  Judge1Link: string
  Judge2Link: string
  Judge3Link: string
  judge1Id: number
  judge2Id: number
  judge3Id: number
  judge1Name: string
  judge2Name: string
  judge3Name: string
}


export default function useJudgeLinkCompetitions({
  eventId,
  categoryId,
}: {
  eventId: string
  categoryId: string
}) {
  return useQuery({
    queryKey: [
      'judgeLinks/competitions',
      { categoryId,eventId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId


      const res = await api.get<{ data: Competition[] }>(
        '/judgeLinks/competitions',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
