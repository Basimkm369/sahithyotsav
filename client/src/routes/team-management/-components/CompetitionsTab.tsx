import { Competition, useCompetitions } from '@/routes/team-management/-hooks/useCompetitions'
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import CompetitionCard from './CompetitionCard'
import CompetitionCardSkeleton from './CompetitionCardSkeleton'

const ITEMS_PER_PAGE = 24

export default function CompetitionsTab({
  categories,
  stages,
}: {
  categories: TeamManagementSummary['categories']
  stages: TeamManagementSummary['stages']
}) {
  const [status, setStatus] = useState('all')
  const [stageId, setStageId] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useCompetitions({
    status,
    stageId,
    categoryId,
    page,
    limit: ITEMS_PER_PAGE,
  })

  if (!isLoading && !data) return 'No data found'
  if (error) return `Error: ${error}`

  const totalPages = data?.[0]?.totalCount
    ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE)
    : 1

  return (
    <>
      <div className="grid gap-4 my-4">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {/* Stage Filter */}
          <Select
            value={stageId}
            onValueChange={(value) => {
              setStageId(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px]">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem value={stage.number}>{stage.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="N">Not Started</SelectItem>
              <SelectItem value="S">Started</SelectItem>
              <SelectItem value="P">In Progress</SelectItem>
              <SelectItem value="C">Completed</SelectItem>
              <SelectItem value="A">Announced</SelectItem>
              <SelectItem value="D">Prize Distributed</SelectItem>
            </SelectContent>
          </Select>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 24 }, () => 0).map((_, i) => (
                <CompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <CompetitionCard data={comp} key={comp.id} />
              ))}
        </div>

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
    </>
  )
}
