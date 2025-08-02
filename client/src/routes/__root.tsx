import * as React from 'react'
import {
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})


const queryClient = new QueryClient()
function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}


          {/* Main content */}
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>

        <TanStackRouterDevtools position="bottom-right" />
      </QueryClientProvider>
    </>
  )
}
