import useStageCompetitions from '../-hooks/useStageCompetitions'
import { StageManagementSummary } from '@/routes/stage-management/-hooks/useStageManagementSummary'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useState } from 'react'
import StageCompetitionCard from './StageCompetitionCard'
import StageCompetitionCardSkeleton from './StageCompetitionCardSkeleton'
import PaginationControls from '@/components/PaginationControls'
import { Route } from '..'

const ITEMS_PER_PAGE = 24

export default function StageCompetitions({
  categories,
}: {
  categories: StageManagementSummary['categories']
}) {
  const [status, setStatus] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const [page, setPage] = useState(1)

  const { stageId, eventId } = Route.useSearch()
  const { data, isLoading, error } = useStageCompetitions({
    stageId,
    eventId,
    status,
    categoryId,
    page,
    limit: ITEMS_PER_PAGE,
  })

  if (!isLoading && error) return `Error: ${error}`
  if (!isLoading && !data) return 'No data found'

  const totalPages = data?.[0]?.totalCount
    ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE)
    : 1

  return (
    <>
      <div className="grid gap-4 my-4">
        <div className="flex flex-wrap gap-4 justify-center items-center">
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
                <StageCompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <StageCompetitionCard data={comp} key={comp.id} />
              ))}
        </div>

        <div className="w-full flex justify-center mt-4">
          <PaginationControls
            totalPages={totalPages}
            page={page}
            onChange={setPage}
            className="mt-4"
          />
        </div>
      </div>
    </>
  )
}
