import { Badge } from '@/components/ui/badge'

export const getCompetitionStatusBadge = (status: string, count?: number) => {
  const getLabel = () => {
    switch (status) {
      case 'N':
        return 'Not Started'
      case 'S':
        return 'Started'
      case 'P':
        return 'In Progress'
      case 'C':
      case 'M':
      case 'F':
      case 'O':
        return 'Completed'
      case 'A':
        return 'Announced'
      case 'D':
        return 'Prize Distributed'
      default:
        return status
    }
  }

  const label = count !== undefined ? `${count} ${getLabel()}` : getLabel()

  switch (status) {
    case 'N':
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          {label}
        </Badge>
      )
    case 'S':
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          {label}
        </Badge>
      )
    case 'P':
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          {label}
        </Badge>
      )
    case 'C':
    case 'M':
    case 'F':
    case 'O':
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {label}
        </Badge>
      )
    case 'A':
      return (
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-800 border-purple-200"
        >
          {label}
        </Badge>
      )
    case 'D':
      return (
        <Badge
          variant="outline"
          className="bg-teal-100 text-teal-800 border-teal-200"
        >
          {label}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          {label}
        </Badge>
      )
  }
}

export const getParticipantStatusBadge = (status: string) => {
  switch (status) {
    case 'E': // Enrolled
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          Enrolled
        </Badge>
      )

    case 'I': // In Progress
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          In Progress
        </Badge>
      )

    case 'C': // Completed
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Completed
        </Badge>
      )

    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          {status}
        </Badge>
      )
  }
}
