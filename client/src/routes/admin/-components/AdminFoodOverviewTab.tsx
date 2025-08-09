import useAdminFoodOverview from '../-hooks/useAdminFoodOverview'
import { Route } from '..'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useUrlState from '@/hooks/useUrlState'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Table } from 'lucide-react'

export default function AdminFoodOverviewTab() {
  const { eventId } = Route.useSearch()

  const [type, setType] = useUrlState('foodType', 'Breakfast')
  const [date, setDate] = useUrlState('foodDate', '10-08-2025')

  const { data, isLoading } = useAdminFoodOverview({ eventId, type, date })

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

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {/* Date Filter */}
        <Select
          value={date}
          onValueChange={(value) => {
            setDate(value)
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'09-08-2025'}>09-08-2025</SelectItem>
            <SelectItem value={'10-08-2025'}>10-08-2025</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value)
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Breakfast">Breakfast</SelectItem>
            <SelectItem value="Lunch">Lunch</SelectItem>
            <SelectItem value="Dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Scanned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 30 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.map((row) => (
                  <TableRow key={row.hourSlot}>
                    <TableCell>{row.hourSlot}</TableCell>
                    <TableCell>{row.count}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
