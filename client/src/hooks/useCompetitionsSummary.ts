import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type CompetitionSummary = {
    count: number
    stage: string
  }
  
  type ApiResponse = {
    msg: string
    status: number
    data: CompetitionSummary[]
  }

  export function useCompetitionsSummary() {
    return useQuery<CompetitionSummary[]>({
      queryKey: ['competition-summary'],
      queryFn: async () => {
        const response = await api.get<ApiResponse>('/teamManagement')
        return response.data.data
      },
      staleTime: 5 * 60 * 1000, // cache for 5 minutes
    })
  }
