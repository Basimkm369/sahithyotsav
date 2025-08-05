import { Card } from '@/components/ui/card'
import { Participant } from '../-hooks/useAdminParticipants'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getCompetitionStatusBadge,
  getParticipantStatusBadge,
} from '@/lib/badge'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import PaginationControls from '@/components/PaginationControls'
import { Route } from '..'
import useAdminParticipants from '../-hooks/useAdminParticipants'
import { AdminSummary } from '../-hooks/useAdminSummary'

const ITEMS_PER_PAGE = 30
export default function AdminParticipantsTab({
  categories,
  teams,
}: {
  categories: AdminSummary['categories']
  teams: AdminSummary['teams']
}) {
  const [categoryId, setCategoryId] = useState('all')
  const [teamId, setTeamId] = useState('all')

  const [page, setPage] = useState(1)

  const { eventId } = Route.useSearch()
  const { data, isLoading, error } = useAdminParticipants({
    eventId,
    categoryId,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const [selectedParticipant, setSelectedParticipant] = useState<Participant>()

  if (!isLoading && error) return `Error: ${error}`
  if (!isLoading && !data) return 'No data found'

  const totalPages = data?.[0]?.totalCount
    ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE)
    : 1

  return (
    <>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {/* Category Filter */}
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem value={`${category.number}`}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Team Filter */}
          <Select
            value={teamId}
            onValueChange={(value) => {
              setTeamId(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem value={`${team.number}`}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="py-0 overflow-hidden">
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Competitions</TableHead>
                <TableHead>Awards</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 30 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-10" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xl flex gap-1">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : data?.map((participant) => (
                    <TableRow
                      key={participant.chestNumber}
                      onClick={() => setSelectedParticipant(participant)}
                    >
                      <TableCell>
                        {participant.name}{' '}
                        <span className="text-gray-500">
                          #{participant.chestNumber}
                        </span>
                      </TableCell>
                      <TableCell>{participant.categoryName}</TableCell>
                      <TableCell>
                        {(() => {
                          const statusCounts: Record<string, number> = {}
                          participant.competitions.forEach((c) => {
                            statusCounts[c.status] =
                              (statusCounts[c.status] || 0) + 1
                          })

                          return Object.entries(statusCounts).map(
                            ([status, count]) => (
                              <span key={status} className="mr-1">
                                {getCompetitionStatusBadge(status, count)}
                              </span>
                            ),
                          )
                        })()}
                      </TableCell>
                      <TableCell className="text-xl">
                        {participant.competitions
                          .sort((a, b) => a.rank - b.rank)
                          .map((c) =>
                            c.rank === 1
                              ? '🥇'
                              : c.rank === 2
                                ? '🥈'
                                : c.rank === 3
                                  ? '🥉'
                                  : '',
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </Card>
        <div className="w-full flex justify-center">
          {/* Pagination */}
          <PaginationControls
            totalPages={totalPages}
            page={page}
            onChange={setPage}
          />
        </div>
      </div>
      <Dialog
        open={!!selectedParticipant}
        onOpenChange={() => setSelectedParticipant(undefined)}
      >
        {!!selectedParticipant && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedParticipant.name} - {selectedParticipant.categoryName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 mt-4">
              {selectedParticipant.competitions.map((competition, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'pb-3',
                    idx < selectedParticipant.competitions.length - 1 &&
                      'border-b border-gray-200',
                  )}
                >
                  <div className="font-medium flex gap-2">
                    {competition.itemName}
                    {getCompetitionStatusBadge(competition.status)}
                    {getParticipantStatusBadge(competition.participantStatus)}
                    {competition.rank === 1
                      ? '🥇'
                      : competition.rank === 2
                        ? '🥈'
                        : competition.rank === 3
                          ? '🥉'
                          : ''}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
