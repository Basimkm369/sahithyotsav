import { createFileRoute } from '@tanstack/react-router'
import useOffstageManagementSummary from './-hooks/useOffstageManagementSummary'
import LoadingSpinner from '@/components/LoadingSpinner'
import OffstageCompetitions from './-components/OffstageCompetitions'

export const Route = createFileRoute('/offstage-management/')({
  component: OffstageValuationPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; stageId: string } => {
    return {
      eventId: search.eventId as string,
      stageId: search.stageId as string,
    }
  },
})

function OffstageValuationPage() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useOffstageManagementSummary({ eventId })

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
          <div className="text-4xl font-bold font-heading">
            Offstage Valuation Management
          </div>
        </div>
      </div>
      <div className="bg-muted rounded-3xl p-4">
        <OffstageCompetitions
          categories={data.categories}
          stages={data.stages}
        />
      </div>
    </div>
  )
}
