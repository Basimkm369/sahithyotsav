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
      eventId: search.eventId as string,
      stageId: search.stageId as string,
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
          <div className="text-2xl font-semibold font-heading">Stage Management</div>
          <div className="text-5xl font-bold font-heading"> {data.stageName}</div>
        </div>
      </div>
      <StageCompetitions categories={data.categories} />
    </div>
  )
}
