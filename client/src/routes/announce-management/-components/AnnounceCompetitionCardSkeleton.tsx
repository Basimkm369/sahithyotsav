import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LucideMapPin, LucideCalendar, LucideClock } from 'lucide-react'

export default function AnnounceCompetitionCardSkeleton() {
  return (
    <Card className="gap-3 py-4 pt-5 animate-pulse">
      <CardHeader className="flex flex-nowrap justify-between">
        <div>
          <CardTitle className="text-lg uppercase">
            <Skeleton className="h-5 w-40" />
          </CardTitle>
          <CardDescription className="uppercase">
            <Skeleton className="h-4 w-24 mt-1" />
          </CardDescription>
        </div>
        <div className="mt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <div className="flex gap-1 items-center flex-nowrap">
            <LucideMapPin className="w-4 opacity-40" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-1 items-center flex-nowrap">
            <LucideCalendar className="w-4 opacity-40" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex gap-1 items-center flex-nowrap">
            <LucideClock className="w-4 opacity-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
