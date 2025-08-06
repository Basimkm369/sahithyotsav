import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type TeamPoint = {
  rank: number
  teamName: string
  normalCount: number
  normalPoints: number
  campusCount: number
  campusPoints: number
  totalPoints: number
}

export default function useAnnouncementTeamPoints({
  eventId
}: {
  eventId: string
}) {
  return useQuery({
    queryKey: [
      'announcementControl',
      'teamPoints',
      { eventId },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {}
     
      if (eventId) params.eventId = eventId
      const res = await api.get<{ data: TeamPoint[] }>(
        '/announcementControl/teamPoints',
        { params },
      )
      return res.data?.data ?? null
    },
    refetchInterval: 5 * 1000,
  })
}
