import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useOffstageCompetitions'
import { Route } from '..'
import { ScrollArea } from '@/components/ui/scroll-area'
import Button from '@/components/Button'
import { getCompetitionStatusBadge } from '@/lib/badge'
import CompetitionStatus from '@/constants/CompetitionStatus'
import useConfirmation from '@/components/Confirmation'
import { api } from '@/lib/api'
import queryClient from '@/lib/queryClient'
import { Skeleton } from '@/components/ui/skeleton'
import { LuCircleCheckBig, LuCircleX } from 'react-icons/lu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import useOffstageCompetitionDetails from '../-hooks/useOffstageCompetitionDetails'
import OffstageCompetitionParticipant from './OffstageCompetitionParticipant'

export default function OffstageCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useOffstageCompetitionDetails({
    eventId,
    itemId: competition?.itemCode,
  })

  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/offstageManagement/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        status,
      })
      await queryClient.invalidateQueries({
        queryKey: ['offstageManagement', 'competitions'],
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
                {competition.name} - {competition.categoryName}
              </DialogTitle>
              {getCompetitionStatusBadge(
                competition.status as CompetitionStatus,
                {
                  role: 'offstageManagement',
                },
              )}
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
              <div className="mt-4 pr-2 space-y-8">
                {competition.status === CompetitionStatus.Completed && (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Badge
                        className={cn(
                          'pl-1.5',
                          competition.judge1Submitted
                            ? 'bg-green-400/20 border-green-300/60 text-green-900'
                            : 'bg-red-400/20 border-red-300/60 text-red-900',
                        )}
                      >
                        {competition.judge1Submitted ? (
                          <LuCircleCheckBig />
                        ) : (
                          <LuCircleX />
                        )}
                        {competition.judge1Name}
                      </Badge>
                      <Badge
                        className={cn(
                          'pl-1.5',
                          competition.judge2Submitted
                            ? 'bg-green-400/20 border-green-300/60 text-green-900'
                            : 'bg-red-400/20 border-red-300/60 text-red-900',
                        )}
                      >
                        {competition.judge2Submitted ? (
                          <LuCircleCheckBig />
                        ) : (
                          <LuCircleX />
                        )}
                        {competition.judge2Name}
                      </Badge>
                      <Badge
                        className={cn(
                          'pl-1.5',
                          competition.judge3Submitted
                            ? 'bg-green-400/20 border-green-300/60 text-green-900'
                            : 'bg-red-400/20 border-red-300/60 text-red-900',
                        )}
                      >
                        {competition.judge3Submitted ? (
                          <LuCircleCheckBig />
                        ) : (
                          <LuCircleX />
                        )}
                        {competition.judge3Name}
                      </Badge>
                    </div>
                    <Button
                      disabled={
                        !(
                          competition.judge1Submitted &&
                          competition.judge2Submitted &&
                          competition.judge3Submitted
                        )
                      }
                      onClick={() => {
                        if (
                          !(
                            competition.judge1Submitted &&
                            competition.judge2Submitted &&
                            competition.judge3Submitted
                          )
                        ) {
                          return
                        }
                        promptComfirmation(CompetitionStatus.MarkEntryClosed)
                      }}
                    >
                      Close Mark Entry
                    </Button>
                  </div>
                )}

                <div>
                  {isLoading
                    ? [...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="border-b last:border-b-0 pb-3 mb-3 animate-pulse grid grid-cols-10 items-center gap-2"
                        >
                          <div className="col-span-7 flex gap-4">
                            <Skeleton className="rounded bg-gray-200 h-10 w-10" />
                            <div className="w-full">
                              <Skeleton className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                              <Skeleton className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Skeleton className="h-6 w-16 bg-gray-200 rounded" />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <Skeleton className="h-8 w-24 bg-gray-200 rounded" />
                          </div>
                        </div>
                      ))
                    : data?.participants?.map((participant) => (
                        <div
                          key={participant.chestNumber}
                          className="border-b last:border-b-0 pb-3 mb-3"
                        >
                          <OffstageCompetitionParticipant data={participant} />
                        </div>
                      ))}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
      {component}
    </>
  )
}
