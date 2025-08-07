enum ParticipantStatus {
  NotEnrolled = '',
  Enrolled = 'E',
  InProgress = 'I',
  Completed = 'C',
}

export const statusLabels: Record<string, string> = {
  [ParticipantStatus.NotEnrolled]: 'Not Enrolled',
  [ParticipantStatus.Enrolled]: 'Enrolled',
  [ParticipantStatus.InProgress]: 'In Progress',
  [ParticipantStatus.Completed]: 'Completed',
}

export default ParticipantStatus
