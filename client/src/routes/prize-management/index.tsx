import { createFileRoute } from '@tanstack/react-router'
import MediaCompetitions from './-components/PrizeCompetitions'


export const Route = createFileRoute('/prize-management/')({
  component: PrizeManagementPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; } => {
    return {
      eventId: search.eventId as string
    }
  },
})

function PrizeManagementPage() {

 
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
          <div className="text-3xl font-semibold font-heading text-gray-500">
            Prize Management
          </div>
         
        </div>
      </div>
      <MediaCompetitions />
    
      
    </div>
  )
}
