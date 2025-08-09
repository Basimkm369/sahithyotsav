import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import queryClient from '@/lib/queryClient'

type Args = {
  eventId: string
  itemId: number
  judge1Id: number | null
  judge2Id: number | null
  judge3Id: number | null
}

export default function useOffstageJudgesMutation() {
  return useMutation({
    mutationFn: async (args: Args) => {
      await api.post('/admin/updateCompetition', args)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'competitions'] })
    },
    onError: () => {
      toast.error('Failed to update judges')
    },
  })
}
