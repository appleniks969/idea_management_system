import { Box, Typography, Paper } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material';
import { useIdeaSubmissionTimeline } from '../../hooks/useDashboard';

const SubmissionTimelineChart = () => {
  const theme = useTheme();
  const { data: submissionTimelineData = [], isLoading, error } = useIdeaSubmissionTimeline();

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
      <Paper sx={{ p: 2, minHeight: 550, maxHeight: 650 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Idea Submission Timeline
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, minHeight: 550, maxHeight: 650 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Idea Submission Timeline
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
          <Typography color="error">Error loading chart data</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ p: 2, minHeight: 550, maxHeight: 650, pb: 3, width: '100%', maxWidth: '100%' }}
      component={motion.div}
      variants={chartVariants}
      whileHover={{ boxShadow: 3 }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Idea Submission Timeline
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Trend of idea submissions over the last 6 months.
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={submissionTimelineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 16, fontWeight: 500 }}
            tickMargin={15}
            padding={{ left: 30, right: 30 }}
            stroke="#757575"
            label={{
              value: 'Month',
              position: 'insideBottom',
              offset: -10,
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary, fontSize: 16, fontWeight: 'bold' }
            }}
          />
          <YAxis
            tick={{ fontSize: 14 }}
            tickMargin={15}
            width={100}
            stroke="#757575"
            domain={[0, 30]}
            ticks={[0, 5, 10, 15, 20, 25, 30]}
            label={{
              value: 'Number of Submissions',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary, fontSize: 16, fontWeight: 'bold' },
              dx: -40
            }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 3 }}>
                    <Typography variant="subtitle2">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submissions: {payload[0].value}
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name="Submissions"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 10, strokeWidth: 2, stroke: theme.palette.primary.dark }}
            strokeWidth={4}
            dot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 8, fill: theme.palette.background.paper }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SubmissionTimelineChart;