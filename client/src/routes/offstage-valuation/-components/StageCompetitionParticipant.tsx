import {
  getParticipantStatusBadge,
  getParticipantStatusBadgeV2,
} from '@/lib/badge'
import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'
import { cn } from '@/lib/utils'
import StageParticipantAction from './StageParticipantAction'
import CompetitionStatus from '@/constants/CompetitionStatus'

export default function StageCompetitionParticipant({
  itemCode,
  competitionStatus,
  data,
  onManualEnroll,
}: {
  itemCode: number
  competitionStatus: string
  data: CompetitionDetails['participants'][0]
  onManualEnroll?: () => void
}) {
  return (
    <div className="grid grid-cols-10 gap-2 items-center">
      <div className="col-span-7 flex gap-4">
        <span
          className={cn(
            'uppercase font-bold rounded h-10 w-10 flex items-center justify-center text-lg shadow-sm border',
            data.codeLetter.trim()
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-gray-100 text-gray-400 border-gray-200',
          )}
        >
          {data.codeLetter.trim() || '-'}
        </span>
        <div>
          <div>
            <span className="font-semibold">{data.name}</span>
            <span className="text-gray-500"> #{data.chestNumber}</span>
          </div>
          <div className="text-xs text-gray-600">{data.teamName}</div>
        </div>
      </div>
      <div className="col-span-1">{getParticipantStatusBadgeV2(data)}</div>
      <div className="col-span-2 flex justify-end">
        {[CompetitionStatus.Started, CompetitionStatus.InProgress].includes(
          competitionStatus as CompetitionStatus,
        ) && (
          <StageParticipantAction
            itemCode={itemCode}
            data={data}
            onManualEnroll={onManualEnroll}
          />
        )}
      </div>
    </div>
  )
}
