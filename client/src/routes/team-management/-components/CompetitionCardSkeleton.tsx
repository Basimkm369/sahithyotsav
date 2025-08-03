import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LucideMapPin, LucideCalendar, LucideClock } from 'lucide-react'

export default function CompetitionCardSkeleton() {
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

      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <LucideMapPin className="w-5 opacity-30" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2 items-center">
            <LucideCalendar className="w-5 opacity-30" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2 items-center">
            <LucideClock className="w-5 opacity-30" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="border-t mt-4 pt-3 space-y-2">
          <div className="flex items-center gap-1 border-b last:border-b-0 pb-2 last:pb-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10 ml-2" />
            <div className="ml-auto">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
