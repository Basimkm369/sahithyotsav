import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Competition = {
  id: number
  name: string
  stage: string
  category: string
  status: string
  participants: { name: string; chestNumber: string }[]
}

export function useCompetitions(status: string, stage: string) {
  return useQuery({
    queryKey: ['competitions', status, stage],
    queryFn: async () => {
      const params: any = {}
      if (status !== 'all') params.status = status
      if (stage !== 'all') params.stage = stage

      const res = await api.get<Competition[]>('/competitions', { params })
      return res.data
    },
    keepPreviousData: true,
  })
}
