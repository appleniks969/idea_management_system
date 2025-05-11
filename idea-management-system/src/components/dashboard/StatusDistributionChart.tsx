import { Box, Typography, Paper } from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material';
import { useStatusDistribution } from '../../hooks/useDashboard';
import { IdeaStatus } from '../../types';
import { StatusChip } from '../common/StatusChip';

// Helper function to format status text
const formatStatus = (status: IdeaStatus) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const StatusDistributionChart = () => {
  const theme = useTheme();
  const { data: statusDistributionData = [], isLoading, error } = useStatusDistribution();

  // Colors for the charts based on status
  const STATUS_COLORS = {
    [IdeaStatus.APPROVED]: theme.palette.success.main,
    [IdeaStatus.UNDER_REVIEW]: theme.palette.info.main,
    [IdeaStatus.SUBMITTED]: theme.palette.primary.main,
    [IdeaStatus.REVISION_REQUESTED]: theme.palette.warning.main,
    [IdeaStatus.REJECTED]: theme.palette.error.main
  };

  // Framer motion animation variants
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Idea Status Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Idea Status Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
          <Typography color="error">Error loading chart data</Typography>
        </Box>
      </Paper>
    );
  }

  const totalIdeas = statusDistributionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Paper
      sx={{ p: 3, height: '100%' }}
      component={motion.div}
      variants={chartVariants}
      whileHover={{ boxShadow: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Idea Status Distribution
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Distribution of ideas by their current status in the workflow.
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={statusDistributionData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
          >
            {statusDistributionData.map((entry, index) => {
              const status = Object.values(IdeaStatus).find(
                status => formatStatus(status) === entry.name
              ) as IdeaStatus;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={status ? STATUS_COLORS[status] : theme.palette.grey[500]}
                />
              );
            })}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 3 }}>
                    <Typography variant="subtitle2">{data.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Count: {data.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Percentage: {((data.value / totalIdeas) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Status legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
        {statusDistributionData.map((entry) => {
          const status = Object.values(IdeaStatus).find(
            status => formatStatus(status) === entry.name
          ) as IdeaStatus;
          
          if (status) {
            return (
              <Box key={entry.name} sx={{ mx: 1, mb: 1 }}>
                <StatusChip status={status} />
              </Box>
            );
          }
          return null;
        })}
      </Box>
    </Paper>
  );
};

export default StatusDistributionChart;