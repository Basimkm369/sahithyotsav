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
import StageCompetitionParticipantCard from './StageCompetitionParticipantCard'

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
         <DialogContent className="!max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {competition.name} - {competition.categoryName}
            </DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="h-40">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="mt-4 overflow-y-auto max-h-[calc(80vh-100px)] pr-2">
            <div className="grid gap-3">
              {data?.participants?.map((participant) => (
                <StageCompetitionParticipantCard
                  data={participant}
                />
              ))}
            </div>
          </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}
