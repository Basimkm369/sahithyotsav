import LoadingSpinner from '@/components/LoadingSpinner'
import { createFileRoute } from '@tanstack/react-router'
import ScoreCards from './-components/ScoreCards'
import useJudgementSummary from './-hooks/useJudgementSummary'
import JudgementNotes from './-components/JudgementNotes'
import { LuCircleUser } from 'react-icons/lu'
import CompetitionStatus from '@/constants/CompetitionStatus'
import Button from '@/components/Button'
import useConfirmation from '@/components/Confirmation'
import { api } from '@/lib/api'
import queryClient from '@/lib/queryClient'

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

  const [component, promptConfirmation] = useConfirmation({
    title: '',
    description: '',
    onConfirm: async ({ eventId, itemId, judgeId }) => {
      await api.post('/judgement/submit', {
        eventId,
        itemId,
        judgeId,
      })
      await queryClient.invalidateQueries({
        queryKey: ['judgement', { eventId, itemId, judgeId }],
      })
    },
  })

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
      {component}
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
        <div>
          <div className="text-center items-end flex gap-3 mt-2 border-t pt-3">
            <div className="text-3xl font-semibold font-heading text-gray-500">
              Judgement:{' '}
            </div>
            <div className="text-4xl font-bold font-heading">
              {data.itemName} - {data.categoryName}
            </div>
          </div>
          <div className="mt-2 text-center text-xl font-medium flex items-center justify-center gap-2">
            <LuCircleUser className="opacity-90" />
            {data.judgeName}
          </div>
        </div>
      </div>
      {[CompetitionStatus.NotStarted, CompetitionStatus.Started].includes(
        data.competitionStatus as CompetitionStatus,
      ) ? (
        <div className="text-2xl text-red-600 font-medium text-center my-10 bg-red-100 border border-red-300 rounded-3xl py-8 px-10 w-fit mx-auto">
          The competition is yet to start
        </div>
      ) : [CompetitionStatus.InProgress, CompetitionStatus.Completed].includes(
          data.competitionStatus as CompetitionStatus,
        ) ? (
        <div className="bg-muted rounded-3xl p-4 space-y-4">
          <ScoreCards data={data} />
          <JudgementNotes data={data} />
          <Button onClick={() => promptConfirmation(data)}>
            Finalize & Submit
          </Button>
        </div>
      ) : (
        <div className="text-2xl text-red-600 font-medium text-center my-10 bg-red-100 border border-red-300 rounded-3xl py-8 px-10 w-fit mx-auto">
          The competition is already completed
        </div>
      )}
    </div>
  )
}
