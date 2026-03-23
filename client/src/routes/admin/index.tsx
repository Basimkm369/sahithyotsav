import { createFileRoute } from '@tanstack/react-router'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUrlState from '@/hooks/useUrlState'
import useAdminSummary from './-hooks/useAdminSummary'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AdminCompetitionsTab from './-components/AdminCompetitionsTab'
import AdminParticipantsTab from './-components/AdminParticipantsTab'
import AdminOverview from './-components/AdminOverviewTab'
import AdminFoodOverView from './-components/AdminFoodOverviewTab'
import { isMockApiEnabled } from '@/lib/api'

export const Route = createFileRoute('/admin/')({
  component: StageManagementPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; pin: string } => {
    return {
      eventId: typeof search.eventId === 'string' ? search.eventId : '',
      pin: typeof search.pin === 'string' ? search.pin : '',
    }
  },
})

function StageManagementPage() {
  const { eventId, pin } = Route.useSearch()
  const { data, isLoading } = useAdminSummary({ eventId })
  const [tab, setTab] = useUrlState<
    'overview' | 'competitions' | 'participants' | 'food'
  >('tab', 'overview')

  const isUnlocked = isMockApiEnabled || pin === '07yqnKmkk0KBpJx'
  if (!isUnlocked) {
    return null
  }
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
        className="flex flex-col gap-4 justify-center items-center pt-8 md:pt-12 -mx-4"
        style={{
          background: 'linear-gradient(to bottom, #f8ebc8 0%, #fff 100%)',
        }}
      >
        <div className="w-full max-w-200 px-6">
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
          <TabsList className='flex-wrap'>
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
            <TabsTrigger
              value="food"
              onClick={() => setTab('food')}
            >
              Food
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="bg-muted rounded-3xl p-4">
          <AdminOverview />
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
        <TabsContent value="food" className="bg-muted rounded-3xl p-4">
          <AdminFoodOverView/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
