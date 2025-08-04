import useStageCompetitions, {
  Competition,
} from '../-hooks/useStageCompetitions'
import { StageManagementSummary } from '@/routes/stage-management/-hooks/useStageManagementSummary'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import StageCompetitionCard from './StageCompetitionCard'
import StageCompetitionCardSkeleton from './StageCompetitionCardSkeleton'
import PaginationControls from '@/components/PaginationControls'
import { Route } from '..'
import StageCompetitionModal from './StageCompetitionModal'
import useUrlState from '@/hooks/useUrlState'
import CompetitionStatus from '@/constants/CompetitionStatus'

const ITEMS_PER_PAGE = 24

export default function StageCompetitions({
  categories,
}: {
  categories: StageManagementSummary['categories']
}) {
  const [status, setStatus] = useUrlState('status', 'all')
  const [categoryId, setCategoryId] = useUrlState('categoryId', 'all')
  const [page, setPage] = useUrlState('page', 1, (v) => (v ? parseInt(v) : 1))

  const { stageId, eventId } = Route.useSearch()
  const { data, isLoading, error } = useStageCompetitions({
    stageId,
    eventId,
    status,
    categoryId,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const [selectedCompetition, setSelectedCompetition] =
    useUrlState<Competition>(
      'competition',
      undefined,
      (id) => data?.find((d) => d.itemCode.toString() === id),
      (v) => v?.itemCode.toString(),
    )

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
                <StageCompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <StageCompetitionCard
                  data={comp}
                  key={comp.itemCode}
                  onClick={() => setSelectedCompetition(comp)}
                />
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
      <StageCompetitionModal
        data={selectedCompetition}
        open={!!selectedCompetition}
        onClose={() => setSelectedCompetition(undefined)}
      />
    </>
  )
}
