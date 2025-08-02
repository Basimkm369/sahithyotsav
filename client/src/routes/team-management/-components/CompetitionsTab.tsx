import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCompetitions } from '@/hooks/useCompetitions'
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

  if (isFetching) return 'Loading...'
  if (!data) return 'No data found'
  if (error) return `Error: ${error}`

  // const [selectedCompetition, setSelectedCompetition] =
  //   useState<Competition | null>(null)
  // const [selectedParticipant, setSelectedParticipant] =
  //   useState<Participant | null>(null)

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'S':
        return 'Scheduled'
      case 'F':
        return 'Finished'
      case 'N':
        return 'Not Started'
      case 'M':
        return 'In Progress'
      default:
        return status
    }
  }

  return (
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
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="F">F</SelectItem>
              <SelectItem value="N">N</SelectItem>
              <SelectItem value="M">M</SelectItem>
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
                <SelectItem value={category.number}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((comp) => (
          <Card key={comp.id}>
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
                Status: {getStatusDisplay(comp.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
