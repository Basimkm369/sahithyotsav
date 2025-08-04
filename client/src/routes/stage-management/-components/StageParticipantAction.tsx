import Button from '@/components/Button'
import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'

export default function StageParticipantAction({
  data,
}: {
  data: CompetitionDetails['participants'][0]
}) {
  const { status, codeLetter } = data

  if (!status) {
    return <Button size="sm">Report</Button>
  }
  if (status === 'E' && !codeLetter.trim()) {
    return <Button size="sm">Enroll</Button>
  }

  return null
}
