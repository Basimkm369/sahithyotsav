import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useTeamManagementSummary } from '@/hooks/useTeamManagementSummary'
import CompetitionsTab from './-components/CompetitionsTab'
import ParticipantsTab from './-components/ParticipantsTab'
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
  const { data, isLoading } = useTeamManagementSummary()

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  if (!data) return 'No data found'

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-4xl font-bold text-center mt-8 mb-6">
        Team Management: {data.teamName}
      </h2>
      <Tabs defaultValue="competitions">
        <div className="flex justify-center mb-2">
          <TabsList>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="competitions">
          <CompetitionsTab categories={data.categories} stages={data.stages} />
        </TabsContent>
        <TabsContent value="participants">
          <ParticipantsTab categories={data.categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
