import { getParticipantStatusBadge } from '@/lib/badge'
import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'
import { cn } from '@/lib/utils'
import StageParticipantAction from './StageParticipantAction'

export default function StageCompetitionParticipant({
  data,
}: {
  data: CompetitionDetails['participants'][0]
}) {
  return (
    <div className="grid grid-cols-10 gap-2 items-center">
      <div className="col-span-7 flex gap-4">
        <span
          className={cn(
            'font-bold rounded h-10 w-10 flex items-center justify-center text-lg shadow-sm border',
            data.codeLetter.trim()
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-gray-300',
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
      <div className="col-span-1">{getParticipantStatusBadge(data.status)}</div>
      <div className="col-span-2 text-right">
        <StageParticipantAction data={data} />
      </div>
    </div>
  )
}
