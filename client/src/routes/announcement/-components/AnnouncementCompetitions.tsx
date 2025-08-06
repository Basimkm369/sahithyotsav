import useAnnouncementCompetitions, {
  Competition,
} from '../-hooks/useAnnouncementCompetitions'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import AnnouncementCompetitionCard from './AnnouncementCompetitionCard'
import AnnouncementCompetitionCardSkeleton from './AnnouncementCompetitionCardSkeleton'
import PaginationControls from '@/components/PaginationControls'
import { Route } from '..'
import AnnouncementCompetitionModal from './AnnouncementCompetitionModal'
import useUrlState from '@/hooks/useUrlState'
import CompetitionStatus from '@/constants/CompetitionStatus'

const ITEMS_PER_PAGE = 24

export default function AnnouncementCompetitions() {
  const [status, setStatus] = useUrlState('status', 'all')
  const [page, setPage] = useUrlState('page', 1, (v) => (v ? parseInt(v) : 1))

  const { eventId } = Route.useSearch()
  const { data, isLoading, error } = useAnnouncementCompetitions({
    eventId,
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
          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[200px] bg-white">
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
              <SelectItem value={CompetitionStatus.MarkEntryClosed}>
                Mark Entry Closed
              </SelectItem>
              <SelectItem value={CompetitionStatus.Finalized}>
                Finalized
              </SelectItem>
              <SelectItem value={CompetitionStatus.MediaCompleted}>
                Media Completed
              </SelectItem>
              <SelectItem value={CompetitionStatus.Announced}>
                Announced
              </SelectItem>
              <SelectItem value={CompetitionStatus.PrizeDistributed}>
                Prize Distributed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 24 }).map((_, i) => (
                <AnnouncementCompetitionCardSkeleton key={i} />
              ))
            : data?.map((comp) => (
                <AnnouncementCompetitionCard
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

      <AnnouncementCompetitionModal
        data={selectedCompetition}
        open={!!selectedCompetition}
        onClose={() => setSelectedCompetition(undefined)}
      />
    </>
  )
}
