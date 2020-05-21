export const TripStatusTypes = [
  { value: 'Waiting Approval', label: 'Waiting approval', extendedLabel: 'Waiting approval' },
  { value: 'Approved', label: 'Approved', extendedLabel: 'Approved' },
  { value: 'Rejected', label: 'Rejected', extendedLabel: 'Rejected' },
  { value: 'In Progress', label: 'In progress', extendedLabel: 'In progress' },
  { value: 'Cancelled', label: 'Cancelled', extendedLabel: 'Cancelled' },
  { value: 'Completed', label: 'Completed', extendedLabel: 'Completed' },
  { value: 'Aborted', label: 'Aborted', extendedLabel: 'Aborted' },
]

export const ProducerActionApproval = [
  { value: 'Waiting Approval', label: 'Waiting approval', extendedLabel: 'Waiting approval' },
  { value: 'Approved', label: 'Approved', extendedLabel: 'Approved' },
  { value: 'Rejected', label: 'Rejected', extendedLabel: 'Rejected' },
]

export const DriverActionComplete = [
  { value: 'In Progress', label: 'In progress', extendedLabel: 'In progress' },
  { value: 'Completed', label: 'Completed', extendedLabel: 'Completed' },
  { value: 'Aborted', label: 'Aborted', extendedLabel: 'Aborted' },
]

export const TripStatus = {
  Waiting: 'Waiting Approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Aborted: 'Aborted',
}
