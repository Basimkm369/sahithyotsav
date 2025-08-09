import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useAnnounceCompetitions'
import useAnnounceCompetitionDetails from '../-hooks/useAnnounceCompetitionDetails'
import { Route } from '..'
import { ScrollArea } from '@/components/ui/scroll-area'
import Button from '@/components/Button'
import { getCompetitionStatusBadge } from '@/lib/badge'
import CompetitionStatus from '@/constants/CompetitionStatus'
import useConfirmation from '@/components/Confirmation'
import { api } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LuDownload } from 'react-icons/lu'
import { useCallback } from 'react'
import queryClient from '@/lib/queryClient'

export default function AnnounceCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAnnounceCompetitionDetails({
    eventId,
    itemId: competition?.itemCode,
  })

  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/announceManagement/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        status,
      })
      await queryClient.invalidateQueries({
        queryKey: ['announceManagement', 'competitions'],
      })
    },
  })

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        {!!competition && (
          <DialogContent className="!max-w-4xl w-full">
            <DialogHeader className="flex-row gap-2 items-center">
              <DialogTitle>
                #{competition.resultNumber} {competition.name} -{' '}
                {competition.categoryName}
              </DialogTitle>
              {getCompetitionStatusBadge(
                competition.status as CompetitionStatus,
                { role: 'announceMangement' },
              )}
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
              <div className="mt-4 pr-2 space-y-8">
                {competition.status === CompetitionStatus.MediaCompleted && (
                  <Button
                    onClick={() =>
                      promptComfirmation(CompetitionStatus.Announced)
                    }
                  >
                    Complete Announcement
                  </Button>
                )}
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Prize</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Point</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 30 }).map((_, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <div className="flex gap-4 w-100">
                                <Skeleton className="rounded bg-gray-200 h-10 w-10" />
                                <div className="w-full">
                                  <Skeleton className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                                  <Skeleton className="h-3 bg-gray-100 rounded w-2/4" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 bg-gray-200 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 bg-gray-200 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 bg-gray-200 rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      : data?.participants.map((participant) => (
                          <TableRow key={participant.chestNumber}>
                            <TableCell>
                              <div className="flex gap-4">
                                <span
                                  className={cn(
                                    'uppercase font-bold rounded h-10 w-10 flex items-center justify-center text-lg shadow-sm border',
                                    'bg-blue-100 text-blue-700 border-blue-300',
                                  )}
                                >
                                  {participant.codeLetter.trim()}
                                </span>
                                <div>
                                  <div>
                                    <span className="font-semibold">
                                      {participant.name.trim()}&nbsp;
                                    </span>
                                    <span className="text-gray-500">
                                      #{participant.chestNumber}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {participant.teamName}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-2xl">
                              {participant.rank === 1
                                ? '🥇'
                                : participant.rank === 2
                                  ? '🥈'
                                  : participant.rank === 3
                                    ? '🥉'
                                    : ''}
                            </TableCell>
                            <TableCell>{participant.grade}</TableCell>
                            <TableCell>{participant.totalPoint}</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
      {component}
    </>
  )
}
