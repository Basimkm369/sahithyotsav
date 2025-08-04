import LoadingSpinner from '@/components/LoadingSpinner';
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import JudgeDashboard from './-components/JudgeDashboard';
import useJudgementSummary from './-hooks/useJudgementSummary';

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
      </div>
      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>Welcome, Judge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
              {data.judgeName}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg">
                <p> {data.competition.categoryName} - {data.competition.itemName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <JudgeDashboard />
    </div>
  )
}
