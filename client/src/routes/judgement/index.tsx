import LoadingSpinner from '@/components/LoadingSpinner'
import { createFileRoute } from '@tanstack/react-router'
import ScoreCards from './-components/ScoreCards'
import useJudgementSummary from './-hooks/useJudgementSummary'
import JudgementNotes from './-components/JudgementNotes'

export const Route = createFileRoute('/judgement/')({
  component: JudgeDashboardPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; itemId: string; judgeId: string } => {
    return {
      eventId: search.eventId as string,
      itemId: search.itemId as string,
      judgeId: search.judgeId as string,
    }
  },
})

function JudgeDashboardPage() {
  const { eventId, itemId, judgeId } = Route.useSearch()
  const { data, isLoading } = useJudgementSummary({ eventId, itemId, judgeId })

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
          <div className="text-2xl font-semibold">Judgement</div>
          <div className="text-4xl font-bold">
            {data.itemName} - {data.categoryName}
          </div>
          <div className="text-xl font-medium">{data.judgeName}</div>
        </div>
      </div>
      <ScoreCards data={data} />
      <JudgementNotes data={data} />
    </div>
  )
}
