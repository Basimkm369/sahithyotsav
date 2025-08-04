import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import useTeamManagementSummary from '@/routes/team-management/-hooks/useTeamManagementSummary'
import TeamCompetitionsTab from './-components/TeamCompetitionsTab'
import TeamParticipantsTab from './-components/TeamParticipantsTab'
import LoadingSpinner from '@/components/LoadingSpinner'

export const Route = createFileRoute('/team-management/')({
  component: TeamManagementPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; teamId: string } => {
    return {
      eventId: search.eventId as string,
      teamId: search.teamId as string,
    }
  },
})

function TeamManagementPage() {
  const { eventId, teamId } = Route.useSearch()
  const { data, isLoading } = useTeamManagementSummary({ eventId, teamId })

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  if (!data) return 'No data found'

  return (
    <div className="space-y-4 px-4 pb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-6">
        <div className="h-30">
          <img
            src="/banner.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center sm:text-left">
          <div className="text-2xl font-semibold">Team Management</div>
          <div className="text-4xl font-bold"> {data.teamName}</div>
        </div>
      </div>
      <Tabs defaultValue="competitions">
        <div className="flex justify-center mb-2">
          <TabsList>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="competitions">
          <TeamCompetitionsTab
            categories={data.categories}
            stages={data.stages}
          />
        </TabsContent>
        <TabsContent value="participants">
          <TeamParticipantsTab categories={data.categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
