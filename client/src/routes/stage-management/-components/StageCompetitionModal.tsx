import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Competition } from '../-hooks/useStageCompetitions'
import useStageCompetitionDetails from '../-hooks/useStageCompetitionDetails'
import { Route } from '..'
import LoadingSpinner from '@/components/LoadingSpinner'
import StageCompetitionParticipant from './StageCompetitionParticipant'
import { ScrollArea } from '@/components/ui/scroll-area'

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {!!competition && (
        <DialogContent className="!max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              {competition.name} - {competition.categoryName}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto -mr-4 pr-4">
            {isLoading ? (
              <div className="h-40">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="mt-4 pr-2">
                {data?.participants?.map((participant) => (
                  <div
                    key={participant.chestNumber}
                    className="border-b last:border-b-0 pb-3 mb-3"
                  >
                    <StageCompetitionParticipant data={participant} />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  )
}
