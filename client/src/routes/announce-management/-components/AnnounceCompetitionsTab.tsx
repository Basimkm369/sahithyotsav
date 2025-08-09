import useAnnounceCompetitions, {
  Competition,
} from '../-hooks/useAnnounceCompetitions'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import AnnounceCompetitionCard from './AnnounceCompetitionCard'
import AnnounceCompetitionCardSkeleton from './AnnounceCompetitionCardSkeleton'
import PaginationControls from '@/components/PaginationControls'
import { Route } from '..'
import AnnounceCompetitionModal from './AnnounceCompetitionModal'
import useUrlState from '@/hooks/useUrlState'
import { AnnounceManagementSummary } from '../-hooks/useAnnounceManagementSummary'
import CompetitionStatus from '@/constants/CompetitionStatus'

const ITEMS_PER_PAGE = 24

export default function AnnounceCompetitionsTab({
  categories,
  stages,
}: {
  categories: AnnounceManagementSummary['categories']
  stages: AnnounceManagementSummary['stages']
}) {
  const [status, setStatus] = useUrlState(
    'status',
    CompetitionStatus.MediaCompleted,
  )
  const [stageId, setStageId] = useUrlState('stageId', 'all')
  const [categoryId, setCategoryId] = useUrlState('categoryId', 'all')
  const [page, setPage] = useUrlState('page', 1, (v) => (v ? parseInt(v) : 1))

  const { eventId } = Route.useSearch()
  const { data, isLoading, error } = useAnnounceCompetitions({
    eventId,
    stageId,
    categoryId,
    status,
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
          {/* Stage Filter */}
          <Select
            value={stageId}
            onValueChange={(value) => {
              setStageId(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem value={`${stage.number}`}>{stage.name}</SelectItem>
              ))}
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
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem value={`${category.number}`} className="uppercase">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as CompetitionStatus)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CompetitionStatus.MediaCompleted}>
                Media Completed
              </SelectItem>
              <SelectItem value={CompetitionStatus.Announced}>
                Announced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 24 }).map((_, i) => (
                <AnnounceCompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <AnnounceCompetitionCard
                  data={comp}
                  key={comp.itemCode}
                  onClick={() => setSelectedCompetition(comp)}
                />
              ))}
        </div>

        <div className="w-full flex justify-center">
          <PaginationControls
            totalPages={totalPages}
            page={page}
            onChange={setPage}
          />
        </div>
      </div>

      <AnnounceCompetitionModal
        data={selectedCompetition}
        open={!!selectedCompetition}
        onClose={() => setSelectedCompetition(undefined)}
      />
    </>
  )
}
