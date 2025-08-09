import useAdminFoodOverView from '../-hooks/useAdminFoodOverView'
import { Route } from '..'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { statusLabels, statusOrder } from '@/constants/CompetitionStatus'

export default function AdminFoodOverView() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAdminFoodOverView({ eventId })

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
    <div className="flex flex-wrap justify-center gap-6">
      {statusOrder
        .filter((s) => statusCountMap[s])
        .map((status) => (
          <Card key={status} className="gap-2 w-full max-w-50">
            <CardHeader>
              <CardTitle className="capitalize">
                {statusLabels[status] ?? status}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="text-3xl font-bold text-primary font-heading">
                {statusCountMap[status] ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
