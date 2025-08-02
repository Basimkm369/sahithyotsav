import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Route } from '@/routes/team-management'

export type TeamManagementSummary = {
  teamName: string
  stages: { competitionsCount: number; name: string; number: string }[]
  categories: {
    name: string
    number: string
  }[]
}

export function useTeamManagementSummary() {
  const { eventId, teamId } = Route.useSearch()

  return useQuery({
    queryKey: ['teamManagement', { eventId, teamId }],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (eventId) params.eventId = eventId
      if (teamId) params.teamId = teamId

      const res = await api.get<{ data: TeamManagementSummary }>(
        '/teamManagement',
        {
          params,
        },
      )
      return res.data?.data ?? null
    },
    staleTime: 60 * 1000,
  })
}
