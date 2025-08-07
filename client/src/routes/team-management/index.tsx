import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import useTeamManagementSummary from '@/routes/team-management/-hooks/useTeamManagementSummary'
import TeamCompetitionsTab from './-components/TeamCompetitionsTab'
import TeamParticipantsTab from './-components/TeamParticipantsTab'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useState } from 'react'
import useUrlState from '@/hooks/useUrlState'
import TeamFoodTab from './-components/TeamFoodTab'

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
  const [tab, setTab] = useUrlState<'competitions' | 'participants' | 'food'>(
    'tab',
    'competitions',
  )

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
        <div className="flex flex-col sm:flex-row items-end gap-3 mt-2 border-t pt-3 text-center sm:text-left">
          <div className="text-3xl font-semibold font-heading text-gray-500">
            Team Management:{' '}
          </div>
          <div className="text-4xl font-bold font-heading">
            {data.teamName}
          </div>
        </div>

      </div>
      <Tabs value={tab}>
        <div className="flex justify-center mb-4">
          <TabsList>
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
        <TabsContent value="competitions" className="bg-muted rounded-3xl p-4">
          <TeamCompetitionsTab
            categories={data.categories}
            stages={data.stages}
          />
        </TabsContent>
        <TabsContent value="participants" className="bg-muted rounded-3xl p-4">
          <TeamParticipantsTab categories={data.categories} />
        </TabsContent>
        <TabsContent value="food" className="bg-muted rounded-3xl p-4">
          <TeamFoodTab categories={data.categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
