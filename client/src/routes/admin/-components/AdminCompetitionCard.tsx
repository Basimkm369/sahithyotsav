import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  LucideCalendar,
  LucideClock,
  LucideGavel,
  LucideMapPin,
} from 'lucide-react'
import dayjs from 'dayjs'
import { formatTime } from '@/lib/datetime'
import { getCompetitionStatusBadge } from '@/lib/badge'
import { Competition } from '../-hooks/useAdminCompetitions'

export default function AdminCompetitionCard({
  data,
  onClick,
}: {
  data: Competition
  onClick: () => void
}) {
  return (
    <Card className="gap-3 py-4 pt-5" onClick={onClick}>
      <CardHeader className="flex flex-nowrap justify-between">
        <div>
          <CardTitle className="text-lg uppercase">{data.name}</CardTitle>
          <CardDescription className="uppercase">
            {data.categoryName}
          </CardDescription>
        </div>
        <div className="mt-1">{getCompetitionStatusBadge(data.status)}</div>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-end">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <div className="flex gap-1 flex-nowrap">
            <LucideMapPin className="w-4 opacity-40 pb-[3px]" />
            {data.stageName}
          </div>
          {dayjs(data.date).isValid() && (
            <div className="flex gap-1 flex-nowrap">
              <LucideCalendar className="w-4 opacity-40 pb-[3px]" />
              {dayjs(data.date).format('D MMM')}
            </div>
          )}
          {formatTime(data.startTime) && formatTime(data.startTime) && (
            <div className="flex gap-1 flex-nowrap">
              <LucideClock className="w-4 opacity-40 pb-[3px]" />
              {formatTime(data.startTime)} - {formatTime(data.startTime)}
            </div>
          )}
          {(data.judge1Name.trim() ||
            data.judge2Name.trim() ||
            data.judge3Name.trim()) && (
            <div className="flex gap-1 flex-nowrap">
              <LucideGavel className="w-4 opacity-40 pb-[3px]" />
              {[data.judge1Name, data.judge2Name, data.judge3Name]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
