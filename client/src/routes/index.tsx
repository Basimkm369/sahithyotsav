import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <img
      src="/banner.png"
      alt=""
      className="w-screen h-screen object-contain"
    />
  )
}
