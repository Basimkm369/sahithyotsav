import { createFileRoute } from '@tanstack/react-router'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUrlState from '@/hooks/useUrlState'
import useAdminSummary from './-hooks/useAdminSummary'
import AdminCompetitionsTab from './-components/AdminCompetitionsTab'


export const Route = createFileRoute('/judge-assignment/')({
  component: StageManagementPage,
  validateSearch: (search: Record<string, unknown>): { eventId: string } => {
    return {
      eventId: search.eventId as string,
    }
  },
})

function StageManagementPage() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useAdminSummary({ eventId })
 

  // if(pin !=  "07yqnKmkk0KBpJx"){
  //   return "";
  // }

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
          <div className="text-4xl font-bold font-heading">Judge Assignments</div>
        </div>
      </div>
      <AdminCompetitionsTab
            categories={data.categories}
            stages={data.stages}
          />
    </div>
  )
}
