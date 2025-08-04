import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/judgement/')({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; teamId: string } => {
    return {
      eventId: search.eventId as string,
      teamId: search.teamId as string,
    }
  },
})

function RouteComponent() {
  return <div>Hello "/judgement/"!</div>
}
