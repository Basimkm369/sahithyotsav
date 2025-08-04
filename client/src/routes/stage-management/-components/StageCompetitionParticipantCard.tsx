import {
  Card,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  getParticipantStatusBadge,
} from '@/lib/badge'
import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'
import StageParticipantAction from './StageParticipantAction'

export default function StageParticipantCard({ data }: { data: CompetitionDetails }) {
  return (
    <Card className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div className="flex-1 space-y-1">
          <div className="font-semibold">{data.name}
            <span className="text-gray-500"> #{data.chestNumber}</span>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-[6rem_8rem_8rem] gap-3 items-center">
          <Input
            type="text"
            defaultValue={data.codeLetter}
            className="w-full"
            placeholder="Code Letter"
          />

          <div className="h-6 flex items-center">
            {getParticipantStatusBadge(data.status)}
          </div>

          <div className="h-6 flex items-center">
            <StageParticipantAction data={data} />
          </div>
        </div>

      </div>
    </Card>
  )
}
