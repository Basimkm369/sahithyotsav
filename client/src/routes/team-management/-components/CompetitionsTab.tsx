import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Competition, useCompetitions } from '@/hooks/useCompetitions'
import { TeamManagementSummary } from '@/hooks/useTeamManagementSummary'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { parseJSON } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CompetitionsTab({
  categories,
  stages,
}: {
  categories: TeamManagementSummary['categories']
  stages: TeamManagementSummary['stages']
}) {
  const [status, setStatus] = useState('all')
  const [stageId, setStageId] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const [page, setPage] = useState(1)

  const { data, isFetching, error } = useCompetitions({
    status,
    stageId,
    categoryId,
    page,
  })

  const [selectedCompetition, setSelectedCompetition] = useState<Competition>()

  if (isFetching) return 'Loading...'
  if (!data) return 'No data found'
  if (error) return `Error: ${error}`
  const ITEMS_PER_PAGE = 12;
  const totalPages = data?.[0]?.totalCount ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE) : 1;
  
  return (
    <>
      <div className="grid gap-4 my-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center">
          {/* Stage Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="stageId" className="w-[60px] text-right">
              Stage
            </Label>
            <Select
              value={stageId}
              onValueChange={(value) => {
                setStageId(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[160px] sm:w-[200px]">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {stages.map((stage) => (
                  <SelectItem value={stage.number}>{stage.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="status" className="w-[60px] text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[160px] sm:w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="N">Not Started</SelectItem>
                <SelectItem value="S">Started</SelectItem>
                <SelectItem value="P">In Progress</SelectItem>
                <SelectItem value="C">Completed</SelectItem>
                <SelectItem value="A">Announced</SelectItem>
                <SelectItem value="D">Prize Distributed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="categoryId" className="w-[60px] text-right">
              Category
            </Label>
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[160px] sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem value={category.number}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((comp) => (
            <Card
              key={comp.id}
              onClick={() => setSelectedCompetition(comp)}
              className="cursor-pointer"
            >
              <CardHeader>
                <CardTitle>{comp.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Stage: {comp.stageName}
                </div>
                <div className="text-sm text-gray-600">
                  Category: {comp.categoryName}
                </div>
                <div className="text-sm text-gray-600">
                  Status: {getCompetitionStatusBadge(comp.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
           {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>

                <PaginationItem className="px-4 flex items-center">
                  Page {page} of {totalPages}
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      <Dialog
        open={!!selectedCompetition}
        onOpenChange={() => setSelectedCompetition(undefined)}
      >
        {!!selectedCompetition && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCompetition!.name} -{' '}
                {selectedCompetition!.categoryName}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-3 mt-4">
              {selectedCompetition!.participants.map((participant, idx) => (
                <Card key={idx} className="p-3">
                  <div className="font-medium">{participant.name}</div>
                  <div className="text-sm text-gray-600">
                    Chest #: {participant.chestNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    Name: {participant.name}
                  </div>
                  {participant.status && (
                    <div className="text-sm text-gray-600">
                      Status:{" "}
                      {{
                        E: "Enrolled",
                        I: "In Progress",
                        C: "Completed"
                      }[participant.status] || participant.status}
                    </div>
                  )}

                </Card>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

export const getCompetitionStatusBadge = (status: string) => {
  switch (status) {
    case 'N':
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          Not Started
        </Badge>
      );
    case 'S':
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          Started	
        </Badge>
      );
    case 'P':
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          In Progress
        </Badge>
      );
    case 'C':
    case 'M': // Mark Entry Closed
    case 'F': // Finalized
    case 'O': // Media Completed
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Completed
        </Badge>
      );
    case 'A':
      return (
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-800 border-purple-200"
        >
          Announced
        </Badge>
      );
    case 'D':
      return (
        <Badge
          variant="outline"
          className="bg-teal-100 text-teal-800 border-teal-200"
        >
          Prize Distributed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          {status}
        </Badge>
      );
  }
};

