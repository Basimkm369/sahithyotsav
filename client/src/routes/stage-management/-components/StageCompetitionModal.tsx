import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useStageCompetitions'
import useStageCompetitionDetails, {
  CompetitionDetails,
} from '../-hooks/useStageCompetitionDetails'
import { Route } from '..'
import StageCompetitionParticipant from './StageCompetitionParticipant'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import CodeLetterSelectModal from './CodeLetterSelectModal'
import ParticipantStatus from '@/constants/ParticipantStatus'
import Button from '@/components/Button'
import { getCompetitionStatusBadge } from '@/lib/badge'
import CompetitionStatus from '@/constants/CompetitionStatus'
import useConfirmation from '@/components/Confirmation'
import { api } from '@/lib/api'
import { AiOutlineQrcode } from 'react-icons/ai'
import QRScanDialog from './QRScanDialog'
import useCompetitionParticipantMutation from '../-hooks/useCompetitionParticipantMutation'
import queryClient from '@/lib/queryClient'
import { Skeleton } from '@/components/ui/skeleton'

export default function StageCompetitionModal({
  data: competition,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { stageId, eventId } = Route.useSearch()
  const { data, isLoading } = useStageCompetitionDetails({
    stageId,
    eventId,
    itemId: competition?.itemCode,
  })
  const { mutate } = useCompetitionParticipantMutation()

  const handleValidScan = (participant: { chestNumber: number }) => {
    if (!competition) return
    mutate({
      itemId: competition.itemCode,
      eventId,
      stageId,
      chestNumber: participant.chestNumber,
      status: ParticipantStatus.Enrolled,
    })
  }
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [modalParticipant, setModalParticipant] =
    useState<CompetitionDetails['participants'][0]>()

  const [component, promptComfirmation] = useConfirmation({
    description: 'Are you sure you want to change the competition status?',
    onConfirm: async (status) => {
      if (!competition?.itemCode) return
      await api.post(`/stageManagement/updateCompetitionStatus`, {
        itemCode: competition.itemCode,
        eventId,
        stageId,
        status,
      })
      await queryClient.invalidateQueries({
        queryKey: ['stageManagement', 'competitions'],
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
                    {competition.status === CompetitionStatus.NotStarted && (
                      <Button
                        onClick={() =>
                          promptComfirmation(CompetitionStatus.Started)
                        }
                      >
                        Start Reporting
                      </Button>
                    )}
                    {competition.status === CompetitionStatus.Started && (
                      <Button
                        onClick={() =>
                          promptComfirmation(CompetitionStatus.InProgress)
                        }
                      >
                        Start Program
                      </Button>
                    )}
                    {competition.status === CompetitionStatus.InProgress && (
                      <Button
                        onClick={() =>
                          promptComfirmation(CompetitionStatus.Completed)
                        }
                      >
                        End Program
                      </Button>
                    )}
                    {competition.status === CompetitionStatus.Completed && (
                      <Button
                        onClick={() =>
                          promptComfirmation(CompetitionStatus.MarkEntryClosed)
                        }
                      >
                        Close Mark Entry
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowQRDialog(true)}
                  >
                    <AiOutlineQrcode className="mr-2 h-4 w-4" />
                    Scan QR
                  </Button>

                  <QRScanDialog
                    open={showQRDialog}
                    onClose={() => setShowQRDialog(false)}
                    participants={data?.participants || []}
                    onValidScan={handleValidScan}
                  />
                </div>

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
                          <StageCompetitionParticipant
                            itemCode={competition.itemCode}
                            competitionStatus={competition.status}
                            data={participant}
                            onManualEnroll={() => {
                              setModalParticipant(participant)
                            }}
                          />
                        </div>
                      ))}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
        {!!competition?.itemCode && (
          <CodeLetterSelectModal
            open={!!modalParticipant}
            itemCode={competition.itemCode}
            onClose={() => setModalParticipant(undefined)}
            chestNumber={modalParticipant?.chestNumber ?? 0}
            maxCount={
              data?.participants.filter(
                (p) => p.status === ParticipantStatus.Enrolled,
              ).length ?? 0
            }
            usedLetters={data?.participants.map((p) => p.codeLetter) ?? []}
            isLoading={isLoading}
          />
        )}
      </Dialog>
      {component}
    </>
  )
}
