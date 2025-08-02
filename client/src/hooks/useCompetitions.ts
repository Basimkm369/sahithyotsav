// src/hooks/useCompetitions.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Route } from '@/routes/team-manager' 

type Competition = {
  id: number
  name: string
  stage: string
  category: string
  status: string
  participants: { name: string; chestNumber: string }[]
}

// hooks/useCompetitions.ts
export function useCompetitions(
  status: string,
  stageId: string,
  categoryId: string,
  page: string,
  limit: string,
) {
  const { eventId, teamId } = Route.useSearch() // ✅ useSearch instead of useSearchParams

  return useQuery({
    queryKey: ['teamManagement/competitions', { status, stageId, categoryId,page,limit, eventId, teamId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (status !== 'all') params.status = status
      if (stageId !== 'all') params.stageId = stageId
      if (categoryId !== 'all') params.categoryId = categoryId
      if (eventId) params.eventId = eventId
      if (teamId) params.teamId = teamId
      params.page = page
      params.limit = limit

      const res = await api.get<Competition[]>('/teamManagement/competitions', { params })
      return res.data
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  })
}
