import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { LucideCalendar, LucideClock, LucideMapPin } from 'lucide-react'
import dayjs from 'dayjs'
import { formatTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'
import {
  getCompetitionStatusBadge,
  getParticipantStatusBadge,
} from '@/lib/badge'
import { Competition } from '../-hooks/useTeamCompetitions'
import CompetitionStatus, { isAfterStatus } from '@/constants/CompetitionStatus'
import ParticipantStatus from '@/constants/ParticipantStatus'

export default function TeamCompetitionCard({ data }: { data: Competition }) {
  return (
    <Card className="gap-3 py-4 pt-5">
      <CardHeader className="flex flex-nowrap justify-between">
        <div>
          <CardTitle className="text-lg uppercase">{data.name}</CardTitle>
          <CardDescription className="uppercase">
            {data.categoryName}
          </CardDescription>
        </div>
        <div className="mt-1">
          {getCompetitionStatusBadge(data.status as CompetitionStatus, {
            role: 'teamManagement',
            blink:
              [
                CompetitionStatus.Started,
                CompetitionStatus.InProgress,
              ].includes(data.status as CompetitionStatus) &&
              data.participants.some(
                (p) => p.status === ParticipantStatus.NotEnrolled,
              ) &&
              'Your team participants has reported yet',
          })}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between">
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
          {formatTime(data.startTime) && formatTime(data.endTime) && (
            <div className="flex gap-1 flex-nowrap">
              <LucideClock className="w-4 opacity-40  pb-[3px]" />
              {formatTime(data.startTime)} - {formatTime(data.endTime)}
            </div>
          )}
        </div>
        {!!data.participants.length && (
          <div className="border-t mt-3 pt-3 space-y-2">
            {data.participants.map((participant) => (
              <div key={participant.chestNumber} className={cn('flex gap-1')}>
                {participant.name.trim()}&nbsp;
                <span className="text-gray-500">
                  #{participant.chestNumber}
                </span>
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
                    isAfterStatus(
                      data.status as CompetitionStatus,
                      CompetitionStatus.Started,
                    ) && getParticipantStatusBadge(participant)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
