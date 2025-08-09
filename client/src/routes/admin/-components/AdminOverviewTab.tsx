import useAdminOverview from '../-hooks/useAdminOverview'
import { Route } from '..'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { statusLabels, statusOrder } from '@/constants/CompetitionStatus'

export default function AdminOverview() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAdminOverview({ eventId })

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="gap-2 w-full max-w-50">
            <CardHeader>
              <Skeleton className="h-5 w-1/2 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No overview data available.
      </div>
    )
  }

  const statusCountMap = Object.fromEntries(
    data.countByStatus.map(({ status, count }) => [status, count]),
  )

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {statusOrder
        .filter((s) => statusCountMap[s])
        .map((status) => (
          <Card key={status} className="gap-2">
            <CardHeader>
              <CardTitle className="capitalize">
                {statusLabels[status] ?? status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary font-heading">
                {statusCountMap[status] ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>

  )
}
