enum CompetitionStatus {
  NotStarted = 'N',
  Started = 'S',
  InProgress = 'P',
  Completed = 'C',
  MarkEntryClosed = 'M',
  Finalized = 'F',
  MediaCompleted = 'O',
  Announced = 'A',
  PrizeDistributed = 'D',
}

export const statusLabels: Record<string, string> = {
  [CompetitionStatus.NotStarted]: 'Not Started',
  [CompetitionStatus.Started]: 'Started',
  [CompetitionStatus.InProgress]: 'In Progress',
  [CompetitionStatus.Completed]: 'Completed',
  [CompetitionStatus.MarkEntryClosed]: 'Mark Entry Closed',
  [CompetitionStatus.Finalized]: 'Finalized',
  [CompetitionStatus.MediaCompleted]: 'Media Completed',
  [CompetitionStatus.Announced]: 'Announced',
  [CompetitionStatus.PrizeDistributed]: 'Prize Distributed',
}

export const statusOrder = [
  CompetitionStatus.NotStarted,
  CompetitionStatus.Started,
  CompetitionStatus.InProgress,
  CompetitionStatus.Completed,
  CompetitionStatus.MarkEntryClosed,
  CompetitionStatus.Finalized,
  CompetitionStatus.MediaCompleted,
  CompetitionStatus.Announced,
  CompetitionStatus.PrizeDistributed,
]

export function isBeforeStatus(
  statusA: CompetitionStatus,
  statusB: CompetitionStatus,
): boolean {
  return statusOrder.indexOf(statusA) < statusOrder.indexOf(statusB)
}

export function isAfterStatus(
  statusA: CompetitionStatus,
  statusB: CompetitionStatus,
): boolean {
  return statusOrder.indexOf(statusA) > statusOrder.indexOf(statusB)
}

export default CompetitionStatus
