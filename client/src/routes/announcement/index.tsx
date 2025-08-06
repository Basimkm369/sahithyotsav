import { createFileRoute } from '@tanstack/react-router'
import AnnouncementCompetitions from './-components/AnnouncementCompetitions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AnnouncementTeamPoints from './-components/AnnouncementTeamPoints';
import useUrlState from '@/hooks/useUrlState';

export const Route = createFileRoute('/announcement/')({
  component: AnnouncementControlPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; stageId: string } => {
    return {
      eventId: search.eventId as string,
      stageId: search.stageId as string,
    }
  },
})

function AnnouncementControlPage() {

  const [tab, setTab] = useUrlState<'competitions' | 'team_points'>(
    'tab',
    'competitions',
  )
 
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
          <div className="text-3xl font-semibold font-heading text-gray-500">
          Announcement Dashboard 
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
              value="team_points"
              onClick={() => setTab('team_points')}
            >
              Team Points
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="competitions" className="bg-muted rounded-3xl p-4">
          <AnnouncementCompetitions />
        </TabsContent>
        <TabsContent value="team_points" className="bg-muted rounded-3xl p-4">
          <AnnouncementTeamPoints />
        </TabsContent>
      </Tabs>
      
    </div>
  )
}
