import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Competition } from '../-hooks/useMediaCompetitions'
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-react'
import dayjs from 'dayjs'
import { formatTime } from '@/lib/datetime'
import { getCompetitionStatusBadge } from '@/lib/badge'

export default function MediaCompetitionCard({
  data,
  onClick,
}: {
  data: Competition
  onClick: () => void
}) {
  return (
    <Card className="gap-3 py-4 pt-5 cursor-pointer" onClick={onClick}>
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
            <LucideMapPin className="w-4 opacity-40  pb-[3px]" />
            {data.stageName}
          </div>
          {dayjs(data.date).isValid() && (
            <div className="flex gap-1 flex-nowrap">
              <LucideCalendar className="w-4 opacity-40  pb-[3px]" />
              {dayjs(data.date).format('D MMM')}
            </div>
          )}
          {formatTime(data.startTime) && formatTime(data.startTime) && (
            <div className="flex gap-1 flex-nowrap">
              <LucideClock className="w-4 opacity-40  pb-[3px]" />
              {formatTime(data.startTime)} - {formatTime(data.startTime)}
            </div>
          )}
          
        </div>
      </CardContent>
    </Card>
  )
}
