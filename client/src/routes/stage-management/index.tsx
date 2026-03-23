import { createFileRoute } from '@tanstack/react-router'
import LoadingSpinner from '@/components/LoadingSpinner'
import useStageManagementSummary from '@/routes/stage-management/-hooks/useStageManagementSummary'
import StageCompetitions from './-components/StageCompetitions'

export const Route = createFileRoute('/stage-management/')({
  component: StageManagementPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; stageId: string } => {
    return {
      eventId: typeof search.eventId === 'string' ? search.eventId : '',
      stageId: typeof search.stageId === 'string' && search.stageId
        ? search.stageId
        : '1',
    }
  },
})

function StageManagementPage() {
  const { eventId, stageId } = Route.useSearch()
  const { data, isLoading } = useStageManagementSummary({ eventId, stageId })

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
          <div className="text-3xl font-semibold font-heading text-gray-500">
            Stage Management:{' '}
          </div>
          <div className="text-4xl font-bold font-heading">
            {data.stageName}
          </div>
        </div>
      </div>
      <div className="bg-muted rounded-3xl p-4">
        <StageCompetitions categories={data.categories} />
      </div>
    </div>
  )
}
