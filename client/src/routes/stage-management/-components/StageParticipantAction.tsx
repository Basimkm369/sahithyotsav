import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'
import Button from '@/components/Button'
import ButtonLoader from '@/components/ButtonLoader'
import ParticipantStatus from '@/constants/ParticipantStatus'
import { Route } from '..'
import useCompetitionParticipantMutation from '../-hooks/useCompetitionParticipantMutation'

export default function StageParticipantAction({
  itemCode: itemId,
  data,
  onManualEnroll,
}: {
  itemCode: number
  data: CompetitionDetails['participants'][0]
  onManualEnroll?: () => void
}) {
  const { stageId, eventId } = Route.useSearch()
  const { status, codeLetter, chestNumber } = data
  const { mutate } = useCompetitionParticipantMutation()

  if (!status) {
    return (
      <ButtonLoader
        size="sm"
        onClick={() => {
          mutate({
            itemId,
            eventId,
            stageId,
            chestNumber,
            status: ParticipantStatus.Enrolled,
          })
        }}
      >
        Report
      </ButtonLoader>
    )
  }
  if (status === ParticipantStatus.Enrolled && !codeLetter.trim()) {
    return (
      <div className="flex items-center">
        <Button onClick={onManualEnroll}>Enroll</Button>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-l-none border-l border-l-white/20"
            >
              <LuChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onManualEnroll}>
              Enroll manually
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    )
  }
  return null
}
