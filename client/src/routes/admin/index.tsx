import { createFileRoute } from '@tanstack/react-router'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUrlState from '@/hooks/useUrlState'
import useAdminSummary from './-hooks/useAdminSummary'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AdminCompetitionsTab from './-components/AdminCompetitionsTab'
import AdminParticipantsTab from './-components/AdminParticipantsTab'

export const Route = createFileRoute('/admin/')({
  component: StageManagementPage,
  validateSearch: (search: Record<string, unknown>): { eventId: string } => {
    return {
      eventId: search.eventId as string,
    }
  },
})

function StageManagementPage() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAdminSummary({ eventId })
  const [tab, setTab] = useUrlState<
    'overview' | 'competitions' | 'participants'
  >('tab', 'overview')

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
          <div className="text-4xl font-bold font-heading">Admin Portal</div>
        </div>
      </div>
      <Tabs value={tab}>
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger value="overview" onClick={() => setTab('overview')}>
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="competitions"
              onClick={() => setTab('competitions')}
            >
              Competitions
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              onClick={() => setTab('participants')}
            >
              Participants
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="bg-muted rounded-3xl p-4">
          Overview
        </TabsContent>
        <TabsContent value="competitions" className="bg-muted rounded-3xl p-4">
          <AdminCompetitionsTab
            categories={data.categories}
            stages={data.stages}
          />
        </TabsContent>
        <TabsContent value="participants" className="bg-muted rounded-3xl p-4">
          <AdminParticipantsTab
            categories={data.categories}
            teams={data.teams}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
