import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useMediaCompetitions'
import useMediaCompetitionDetails, {
  CompetitionDetails,
} from '../-hooks/useMediaCompetitionDetails'
import { Route } from '..'
import { ScrollArea } from '@/components/ui/scroll-area'
import Button from '@/components/Button'
import { getCompetitionStatusBadge, getParticipantStatusBadge } from '@/lib/badge'
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
import { AiOutlineDownload } from 'react-icons/ai';


export default function MediaCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { stageId, eventId } = Route.useSearch()
  const { data, isLoading } = useMediaCompetitionDetails({
    eventId,
    itemId: competition?.itemCode,
  })
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      return;
    }

    // Define the CSV header
    const headers = [
      "Chest #",
      "Name",
      "Category",
      "Team",
      "Status",
      "Code Letter",
      "Mark",
      "Grade",
      "Prize"
    ];

    // Create CSV rows from the data
    const rows = data.map((participant) => [
      participant.chestNumber,
      participant.name,
      participant.categoryName,
      participant.teamName,
      participant.status,
      participant.codeLetter,
      participant.mark,
      participant.grade,
      participant.prize,
    ]);

    // Combine header and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell ?? ''}"`).join(","))
      .join("\n");

    // Trigger file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "participants.csv");
    link.click();
  };


  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/mediaControl/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        stageId,
        status,
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
              {getCompetitionStatusBadge(competition.status)}
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
              <div className="mt-4 pr-2 space-y-8">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {competition.status === CompetitionStatus.Finalized && (
                      <Button onClick={() => promptComfirmation(CompetitionStatus.MediaCompleted)}>
                        Mark as Media Completed
                      </Button>
                    )}

                  </div>

                  <Button variant="outline" onClick={handleExportCSV}>
                  <AiOutlineDownload className="mr-2 h-4 w-4" />
                    Export CSV
                    </Button>


                </div>

                <Table>
                  <TableHeader className="bg-white">
                    <TableRow>
                      <TableHead>Chest #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Code Letter</TableHead>
                      <TableHead>Mark</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Prize</TableHead>
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
                      : data?.map((participant) => (
                        <TableRow
                          key={participant.chestNumber}
                        >
                          <TableCell>
                            {participant.chestNumber}

                          </TableCell>
                          <TableCell>{participant.name}</TableCell>
                          <TableCell>{participant.categoryName}</TableCell>
                          <TableCell>{participant.teamName}</TableCell>
                          <TableCell>{getParticipantStatusBadge(participant.status)}</TableCell>
                          <TableCell>{participant.codeLetter}</TableCell>
                          <TableCell>{participant.mark}</TableCell>
                          <TableCell>{participant.grade}</TableCell>
                          <TableCell>{participant.prize}</TableCell>


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
