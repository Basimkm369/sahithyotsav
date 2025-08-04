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
        <DialogContent>
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
            <div className="grid gap-3 mt-4">{JSON.stringify(data)}</div>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}
