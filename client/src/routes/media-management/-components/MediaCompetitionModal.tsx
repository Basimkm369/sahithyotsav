import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useMediaCompetitions'
import useMediaCompetitionDetails from '../-hooks/useMediaCompetitionDetails'
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

export default function MediaCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useMediaCompetitionDetails({
    eventId,
    itemId: competition?.itemCode,
  })

  const handleExportCSV = useCallback(() => {
    if (!competition || !data || data.participants.length === 0) {
      return
    }

    // Define the CSV header
    const headers = ['Chest #', 'Name', 'Team', 'Prize', 'Grade']

    // Create CSV rows from the data
    const rows = data.participants.map((participant) => [
      participant.chestNumber,
      participant.name,
      participant.teamName,
      participant.rank <= 3 ? participant.rank : '',
      participant.grade,
    ])

    // Combine header and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ''}"`).join(','))
      .join('\n')

    // Trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const fileName = `${competition.name.replace(' ', '-').toUpperCase()}-${competition.categoryName.replace(' ', '-').toUpperCase()}.csv`
    link.setAttribute('download', fileName)
    link.click()
  }, [data, competition])

  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/mediaManagement/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        status,
      })
      await queryClient.invalidateQueries({
        queryKey: ['mediaManagement', 'competitions'],
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
                {
                  role: 'mediaMangement',
                },
              )}
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
              <div className="mt-4 pr-2 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {competition.status === CompetitionStatus.Finalized && (
                    <Button
                      onClick={() =>
                        promptComfirmation(CompetitionStatus.MediaCompleted)
                      }
                    >
                      Complete Media
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={handleExportCSV}
                  >
                    <LuDownload className="mr-1 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
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
                                      {participant.name.trim().toUpperCase()}
                                      &nbsp;
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
