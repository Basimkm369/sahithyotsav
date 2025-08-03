import { Card } from '@/components/ui/card'
import { Participant, useParticipants } from '@/routes/team-management/-hooks/useParticipants'
import { TeamManagementSummary } from '@/routes/team-management/-hooks/useTeamManagementSummary'
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCompetitionStatusBadge, getParticipantStatusBadge } from '@/lib/badge'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const ITEMS_PER_PAGE = 30
export default function ParticipantsTab({
  categories,
}: {
  categories: TeamManagementSummary['categories']
}) {
  const [categoryId, setCategoryId] = useState('all')

  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useParticipants({
    categoryId,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const [selectedParticipant, setSelectedParticipant] = useState<Participant>()

  if (!isLoading && !data) return 'No data found'
  if (error) return `Error: ${error}`
  const totalPages = data?.[0]?.totalCount
    ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE)
    : 1

  return (
    <>
      <div className="grid gap-4 my-4">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {/* Category Filter */}
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem value={category.number}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="py-0 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
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
        <div className="w-full flex justify-center mt-4">
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={cn(
                      page === 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'cursor-pointer',
                    )}
                  />
                </PaginationItem>

                <PaginationItem className="px-4 flex items-center">
                  Page {page} of {totalPages}
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={cn(
                      page === totalPages
                        ? 'opacity-30 cursor-not-allowed'
                        : 'cursor-pointer',
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
