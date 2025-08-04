import { TeamManagementSummary } from '@/routes/team-management/-hooks/useTeamManagementSummary'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import useUrlState from '@/hooks/useUrlState'
import { useState } from 'react'
import TeamCompetitionCard from './TeamCompetitionCard'
import TeamCompetitionCardSkeleton from './TeamCompetitionCardSkeleton'
import PaginationControls from '@/components/PaginationControls'
import useTeamCompetitions from '../-hooks/useTeamCompetitions'
import { Route } from '..'
import CompetitionStatus from '@/constants/CompetitionStatus'

const ITEMS_PER_PAGE = 24

export default function TeamCompetitionsTab({
  categories,
  stages,
}: {
  categories: TeamManagementSummary['categories']
  stages: TeamManagementSummary['stages']
}) {
  const [status, setStatus] = useUrlState('status', 'all')
  const [stageId, setStageId] = useUrlState('stageId', 'all')
  const [categoryId, setCategoryId] = useUrlState('categoryId', 'all')
  const [page, setPage] = useUrlState('page', 1, (v) => (v ? parseInt(v) : 1))

  const { eventId, teamId } = Route.useSearch()
  const { data, isLoading, error } = useTeamCompetitions({
    eventId,
    teamId,
    status,
    stageId,
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
                <SelectItem value={`${stage.number}`}>{stage.name}</SelectItem>
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
              <SelectItem value={CompetitionStatus.NotStarted}>
                Not Started
              </SelectItem>
              <SelectItem value={CompetitionStatus.Started}>Started</SelectItem>
              <SelectItem value={CompetitionStatus.InProgress}>
                In Progress
              </SelectItem>
              <SelectItem value={CompetitionStatus.Completed}>
                Completed
              </SelectItem>
              <SelectItem value={CompetitionStatus.Announced}>
                Announced
              </SelectItem>
              <SelectItem value={CompetitionStatus.PrizeDistributed}>
                Prize Distributed
              </SelectItem>
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
                <SelectItem value={`${category.number}`}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 24 }, () => 0).map((_, i) => (
                <TeamCompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <TeamCompetitionCard data={comp} key={comp.id} />
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
