import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import queryClient from '@/lib/queryClient'
import ParticipantStatus from '@/constants/ParticipantStatus'
import { toast } from 'sonner'

type MutationArgs = {
  itemId: number
  eventId: string
  stageId: string
  chestNumber: number
  status?: string
  codeLetter?: string
}

export default function useCompetitionParticipantMutation() {
  return useMutation({
    mutationFn: async ({
      itemId,
      eventId,
      stageId,
      chestNumber,
      status,
      codeLetter,
    }: MutationArgs) => {
      await api.post(`/stageManagement/updateCompetitionParticipant`, {
        itemCode: itemId,
        eventId,
        stageId,
        chestNumber,
        ...(status ? { status } : {}),
        ...(codeLetter ? { codeLetter } : {}),
      })
    },
    onMutate: async ({
      itemId,
      eventId,
      stageId,
      chestNumber,
      status,
      codeLetter,
    }) => {
      const queryKey = [
        'stageManagement',
        'competitions',
        { itemId, eventId, stageId },
      ]

      await queryClient.cancelQueries({ queryKey })
      const prevData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          ...old,
          participants: old.participants.map((p: any) =>
            p.chestNumber === chestNumber
              ? {
                  ...p,
                  ...(status ? { status } : {}),
                  ...(codeLetter ? { codeLetter } : {}),
                }
              : p,
          ),
        }
      })

      return { prevData }
    },
    onError: (_err, { itemId, eventId, stageId }, context) => {
      if (context?.prevData) {
        const queryKey = [
          'stageManagement',
          'competitions',
          { itemId, eventId, stageId },
        ]
        queryClient.setQueryData(queryKey, context.prevData)
      }
      toast.error('Failed to update participant. Please try again.')
    },
    onSettled: (_, __, { itemId, eventId, stageId }) => {
      const queryKey = [
        'stageManagement',
        'competitions',
        { itemId, eventId, stageId },
      ]
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
