import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from './ui/pagination'

export default function PaginationControls({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number
  totalPages: number
  onChange: (value: React.SetStateAction<number>) => void
  className?: string
}) {
  if (totalPages <= 1) return <></>

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onChange((prev) => Math.max(prev - 1, 1))}
            className={cn(
              page === 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
            )}
          />
        </PaginationItem>

        <PaginationItem className="px-4 flex items-center">
          Page {page} of {totalPages}
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => onChange((prev) => Math.min(prev + 1, totalPages))}
            className={cn(
              page === totalPages
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
