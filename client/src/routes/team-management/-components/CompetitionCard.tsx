import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Competition } from '@/hooks/useCompetitions'
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-react'
import dayjs from 'dayjs'
import { formatTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'
import {
  getCompetitionStatusBadge,
  getParticipantStatusBadge,
} from '@/lib/badge'

export default function CompetitionCard({ data }: { data: Competition }) {
  return (
    <Card className="gap-3 py-4 pt-5">
      <CardHeader className="flex flex-nowrap justify-between">
        <div>
          <CardTitle className="text-lg uppercase">{data.name}</CardTitle>
          <CardDescription className="uppercase">
            {data.categoryName}
          </CardDescription>
        </div>
        <div className="mt-1">{getCompetitionStatusBadge(data.status)}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <LucideMapPin className="w-5 opacity-40" />
            {data.stageName}
          </div>
          <div className="flex gap-2">
            <LucideCalendar className="w-5 opacity-40" />
            {dayjs(data.date).format('D MMMM')}
          </div>
          <div className="flex gap-2">
            <LucideClock className="w-5 opacity-40" />
            {formatTime(data.startTime)} - {formatTime(data.startTime)}
          </div>
        </div>
        <div className="border-t mt-3 pt-3 space-y-2">
          {data.participants.map((participant) => (
            <div key={participant.chestNumber} className={cn('flex gap-1')}>
              {participant.name}{' '}
              <span className="text-gray-500">#{participant.chestNumber}</span>
              <div className="ml-auto relative">
                {participant.rank > 0 ? (
                  <div className="text-2xl absolute -top-1 right-0">
                    {participant.rank === 1
                      ? '🥇'
                      : participant.rank === 2
                        ? '🥈'
                        : participant.rank === 3
                          ? '🥉'
                          : ''}
                  </div>
                ) : (
                  getParticipantStatusBadge(participant.status)
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
