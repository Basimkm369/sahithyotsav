import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/judgement/')({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; itemId: string; judgeId: string } => {
    return {
      eventId: search.eventId as string,
      itemId: search.itemId as string,
      judgeId: search.teamId as string,
    }
  },
})

function RouteComponent() {
  return <div>Hello "/judgement/"!</div>
}
