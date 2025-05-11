import { Box, Typography, Paper } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell, 
  LabelList, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material';
import { useDepartmentDistribution } from '../../hooks/useDashboard';

const DepartmentDistributionChart = () => {
  const theme = useTheme();
  const { data: departmentDistributionData = [], isLoading, error } = useDepartmentDistribution();

  // Colors for the charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#6884d8'
  ];

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
          Ideas by Department
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
          Ideas by Department
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
          <Typography color="error">Error loading chart data</Typography>
        </Box>
      </Paper>
    );
  }

  const totalIdeas = departmentDistributionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Paper
      sx={{ p: 3, height: '100%' }}
      component={motion.div}
      variants={chartVariants}
      whileHover={{ boxShadow: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Ideas by Department
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Distribution of submitted ideas across different departments.
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={departmentDistributionData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            scale="band"
            width={75}
            tick={{ fontSize: 12 }}
            tickMargin={5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 3 }}>
                    <Typography variant="subtitle2">{data.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Number of Ideas: {data.value}
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
          <Bar
            dataKey="value"
            name="Ideas"
            animationDuration={1500}
          >
            {departmentDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DepartmentDistributionChart;