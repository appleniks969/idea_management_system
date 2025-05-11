import { Box, Typography, Grid, Divider, Paper } from '@mui/material';
import { Person as PersonIcon, AccessTime as TimeIcon, Category as CategoryIcon } from '@mui/icons-material';
import { Idea } from '../../types';
import { useUser } from '../../hooks/useUsers';
import { StatusChip } from '../common/StatusChip';

interface IdeaHeaderProps {
  idea: Idea;
}

const IdeaHeader = ({ idea }: IdeaHeaderProps) => {
  const { data: submitter } = useUser(idea.submitterId);
  const { data: approver } = useUser(idea.assignedApproverId || '');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {idea.title}
            </Typography>
            <StatusChip status={idea.status} size="medium" />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              Submitted by: {submitter?.fullName || 'Unknown User'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              Submitted on: {new Date(idea.dateSubmitted).toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              Category: {idea.category}
            </Typography>
          </Box>
        </Grid>

        {approver && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                Assigned to: {approver.fullName}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {idea.description}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Expected Benefits
          </Typography>
          <Typography variant="body1" paragraph>
            {idea.benefits}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default IdeaHeader;