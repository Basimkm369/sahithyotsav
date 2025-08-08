import { createFileRoute } from '@tanstack/react-router'
import useUrlState from '@/hooks/useUrlState'
import LoadingSpinner from '@/components/LoadingSpinner'
import useAnnounceManagementSummary from './-hooks/useAnnounceManagementSummary'
import AnnounceCompetitionsTab from './-components/AnnounceCompetitionsTab'

export const Route = createFileRoute('/announce-management/')({
  component: MediaControlPage,
  validateSearch: (search: Record<string, unknown>): { eventId: string } => {
    return {
      eventId: search.eventId as string,
    }
  },
})

function MediaControlPage() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAnnounceManagementSummary({ eventId })
  // const [tab, setTab] = useUrlState<'competitions' | 'teamPoints'>(
  //   'tab',
  //   'competitions',
  // )

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  if (!data) return 'No data found'

  return (
    <div className="space-y-4 px-4 pb-4">
      <div
        className="flex flex-col gap-4 justify-center items-center pt-12 -mx-4"
        style={{
          background: 'linear-gradient(to bottom, #f8ebc8 0%, #fff 100%)',
        }}
      >
        <div className="h-30">
          <img
            src="/sahityotsav-banner.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center items-end flex gap-3 mt-2 border-t pt-3">
          <div className="text-4xl font-bold font-heading">Announcement</div>
        </div>
      </div>
      <div className="bg-muted rounded-3xl p-4">
        <AnnounceCompetitionsTab
          categories={data.categories}
          stages={data.stages}
        />
      </div>
      {/* <Tabs value={tab}>
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger
              value="competitions"
              onClick={() => setTab('competitions')}
            >
              Competitions
            </TabsTrigger>
            <TabsTrigger
              value="teamPoints"
              onClick={() => setTab('teamPoints')}
            >
              Team Points
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="competitions" className="bg-muted rounded-3xl p-4">
          <MediaCompetitionsTab
            categories={data.categories}
            stages={data.stages}
          />
        </TabsContent>
        <TabsContent value="teamPoints" className="bg-muted rounded-3xl p-4">
          <MediaTeamPoints /> 
        </TabsContent>
      </Tabs> */}
    </div>
  )
}
