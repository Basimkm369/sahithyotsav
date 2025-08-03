import { Loader2 } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin w-12 h-12 text-gray-400" />
    </div>
  )
}

export default LoadingSpinner
