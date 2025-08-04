import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'
import Button from '@/components/Button'
import ParticipantStatus from '@/constants/ParticipantStatus'

export default function StageParticipantAction({
  data,
  onManualEnroll,
}: {
  data: CompetitionDetails['participants'][0]
  onManualEnroll?: () => void
}) {
  const { status, codeLetter } = data

  if (!status) {
    return <Button size="sm">Report</Button>
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
