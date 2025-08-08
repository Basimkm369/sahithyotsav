import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/judgement/success')({
  component: JudgeDashboardPage,
})

function JudgeDashboardPage() {
  return (
    <div className="space-y-4 px-4 pb-4">
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
      </div>
      <div className="flex flex-col items-center mt-20">
        <h2 className="text-6xl font-bold font-heading text-green-700 mb-2">
          Thank you!
        </h2>
        <p className="text-lg text-gray-700 text-center">
          Your marks have been submitted successfully.
          <br />
          We appreciate your valuable contribution as a judge.
        </p>
      </div>
    </div>
  )
}
