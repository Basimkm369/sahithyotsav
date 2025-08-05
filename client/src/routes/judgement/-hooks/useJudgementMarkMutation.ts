import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import queryClient from '@/lib/queryClient'

type MutationArgs = {
  eventId: string
  itemId: string
  judgeId: string
  codeLetter: string
  mark: number
}

export function useJudgementMarkMutation() {
  return useMutation({
    mutationFn: async ({
      eventId,
      itemId,
      judgeId,
      codeLetter,
      mark,
    }: MutationArgs) => {
      await api.post('/judgement/updateMark', {
        eventId,
        itemId,
        judgeId,
        codeLetter,
        mark,
      })
    },
    onMutate: async ({ eventId, itemId, judgeId, codeLetter, mark }) => {
      const queryKey = ['judgement', { eventId, itemId, judgeId }]

      await queryClient.cancelQueries({ queryKey })
      const prevData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          ...old,
          scores: old.scores.map((s: any) =>
            s.codeLetter === codeLetter ? { ...s, mark } : s,
          ),
        }
      })

      return { prevData }
    },
    onError: (_err, { eventId, itemId, judgeId }, context) => {
      if (context?.prevData) {
        const queryKey = ['judgement', { eventId, itemId, judgeId }]
        queryClient.setQueryData(queryKey, context.prevData)
      }
      toast.error('Failed to update mark. Please try again.')
    },
    onSettled: (_, __, { eventId, itemId, judgeId }) => {
      const queryKey = ['judgement', { eventId, itemId, judgeId }]
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
