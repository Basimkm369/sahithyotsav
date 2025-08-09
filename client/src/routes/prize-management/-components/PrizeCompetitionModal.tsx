import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/usePrizeCompetitions'
import usePrizeCompetitionDetails from '../-hooks/usePrizeCompetitionDetails'
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
import { Checkbox } from '@/components/ui/checkbox'

export default function PrizeCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = usePrizeCompetitionDetails({
    eventId,
    itemId: competition?.itemCode,
  })

  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/prizeManagement/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        status,
      })
    },
  })

  const handlePrizeToggle = (
    participantId: number,
    type: 'momento' | 'cashPrize',
    checked: boolean,
  ) => {
    // Example: you can send this to API or update state
    // updateParticipantPrize(participantId, type, checked);
  }

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
              )}
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
              <div className="mt-4 pr-2 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {competition.status === CompetitionStatus.Announced && (
                      <Button
                        onClick={() =>
                          promptComfirmation(CompetitionStatus.PrizeDistributed)
                        }
                      >
                        Mark as Prize Distributed
                      </Button>
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader className="bg-white">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Prize</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 30 }).map((_, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <div className="flex gap-2 items-center">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-10" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xl flex gap-1">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : data?.participants?.map((participant) => (
                          <TableRow key={participant.chestNumber}>
                            <TableCell>
                              {participant.name.trim()}&nbsp;
                              <span className="text-gray-500">
                                #{participant.chestNumber}
                              </span>
                              <div className="text-sm text-gray-500">
                                {participant.teamName}
                              </div>
                            </TableCell>

                            <TableCell>{participant.grade}</TableCell>
                            <TableCell>
                              {participant.rank === 1
                                ? '🥇'
                                : participant.rank === 2
                                  ? '🥈'
                                  : participant.rank === 3
                                    ? '🥉'
                                    : ''}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-2">
                                {/* <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`momento-${participant.chestNumber}`}
                                    onCheckedChange={(checked) =>
                                      handlePrizeToggle(
                                        participant.chestNumber,
                                        'momento',
                                        checked,
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`momento-${participant.chestNumber}`}
                                    className="text-sm"
                                  >
                                    Momento
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`cashPrize-${participant.chestNumber}`}
                                    onCheckedChange={(checked) =>
                                      handlePrizeToggle(
                                        participant.chestNumber,
                                        'cashPrize',
                                        checked,
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`cashPrize-${participant.chestNumber}`}
                                    className="text-sm"
                                  >
                                    Cash Prize
                                  </label>
                                </div> */}
                              </div>
                            </TableCell>
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
