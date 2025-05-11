import { Chip } from '@mui/material';
import { IdeaStatus } from '../../types';

interface StatusChipProps {
  status: IdeaStatus;
  size?: 'small' | 'medium';
}

// Helper function to get color for status chips
export const getStatusColor = (status: IdeaStatus) => {
  switch (status) {
    case IdeaStatus.APPROVED:
      return 'success';
    case IdeaStatus.REJECTED:
      return 'error';
    case IdeaStatus.REVISION_REQUESTED:
      return 'warning';
    case IdeaStatus.UNDER_REVIEW:
      return 'info';
    case IdeaStatus.SUBMITTED:
      return 'default';
    default:
      return 'default';
  }
};

// Helper function to format status text
export const formatStatus = (status: IdeaStatus) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const StatusChip = ({ status, size = 'small' }: StatusChipProps) => {
  return (
    <Chip
      label={formatStatus(status)}
      color={getStatusColor(status) as any}
      size={size}
    />
  );
};