import { Badge } from '@/components/ui/badge'
import CompetitionStatus, {
  isAfterStatus,
  isBeforeStatus,
  statusLabels as competitionStatusLabels,
} from '@/constants/CompetitionStatus'
import ParticipantStatus from '@/constants/ParticipantStatus'
import { cn } from './utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

export const getCompetitionStatusBadge = (
  status: CompetitionStatus,
  {
    count,
    role = 'admin',
    blink = false,
  }: {
    count?: number
    role?:
      | 'stageManagement'
      | 'offstageManagement'
      | 'teamManagement'
      | 'mediaMangement'
      | 'announceMangement'
      | 'admin'
    blink?: boolean | string
  } = {},
) => {
 

  if (
    ['stageManagement', 'offstageManagement'].includes(role) &&
    isAfterStatus(status, CompetitionStatus.MarkEntryClosed)
  ) {
    status = CompetitionStatus.MarkEntryClosed
  }

  
  if (
    role === 'teamManagement' &&
    isAfterStatus(status, CompetitionStatus.Completed) &&
    isBeforeStatus(status, CompetitionStatus.Announced)
  ) {
    status = CompetitionStatus.Completed
    
  }
  const label =
  count !== undefined
    ? `${count} ${competitionStatusLabels[status]}`
    : competitionStatusLabels[status]

if (!label) return <></>
  const badge = (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center',
        status === CompetitionStatus.NotStarted &&
          'bg-gray-400/20 text-gray-900 border-gray-300/60',
        status === CompetitionStatus.Started &&
          'bg-blue-400/20 text-blue-900 border-blue-300/60',
        status === CompetitionStatus.InProgress &&
          'bg-yellow-400/20 text-yellow-900 border-yellow-300/60',
        status === CompetitionStatus.Completed &&
          'bg-green-400/20 text-green-900 border-green-300/60',
        status === CompetitionStatus.MarkEntryClosed &&
          'bg-green-400/20 text-green-900 border-green-300/60',
        status === CompetitionStatus.Finalized &&
          'bg-green-400/20 text-green-900 border-green-300/60',
        status === CompetitionStatus.MediaCompleted &&
          'bg-green-400/20 text-green-900 border-green-300/60',
        status === CompetitionStatus.Announced &&
          'bg-green-400/20 text-green-900 border-green-300/60',
        status === CompetitionStatus.PrizeDistributed &&
          'bg-green-400/20 text-green-900 border-green-300/60',
      )}
    >
      {!!blink && (
        <span
          className={cn(
            'blinking-dot',
            status === CompetitionStatus.NotStarted && 'bg-gray-900',
            status === CompetitionStatus.Started && 'bg-blue-900',
            status === CompetitionStatus.InProgress && 'bg-yellow-900',
            status === CompetitionStatus.Completed && 'bg-green-900',
            status === CompetitionStatus.MarkEntryClosed && 'bg-green-900',
            status === CompetitionStatus.Finalized && 'bg-green-900',
            status === CompetitionStatus.MediaCompleted && 'bg-green-900',
            status === CompetitionStatus.Announced && 'bg-green-900',
            status === CompetitionStatus.PrizeDistributed && 'bg-green-900',
          )}
        />
      )}
      {label}
    </Badge>
  )

  if (typeof blink === 'string' && !!blink) {
    return (
      <Tooltip>
        <TooltipTrigger>{badge}</TooltipTrigger>
        <TooltipContent>{blink}</TooltipContent>
      </Tooltip>
    )
  }

  return badge
}

export const getParticipantStatusBadge = ({
  status,
  codeLetter,
}: {
  status: string
  codeLetter: string
}) => {
  if (!status && status !== '') return <></>

  if (status === ParticipantStatus.NotEnrolled) {
    return (
      <Badge
        variant="outline"
        className="bg-gray-400/20 text-gray-800 border-gray-300/60"
      >
        Not Reported
      </Badge>
    )
  }

  if (status === ParticipantStatus.Enrolled && !codeLetter) {
    return (
      <Badge
        variant="outline"
        className="bg-blue-400/20 text-blue-800 border-blue-300/60"
      >
        Reported
      </Badge>
    )
  }

  if (status === ParticipantStatus.Enrolled && codeLetter) {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-200"
      >
        Enrolled
      </Badge>
    )
  }
}
