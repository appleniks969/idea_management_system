import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import SummaryCards from '../components/dashboard/SummaryCards';
import StatusDistributionChart from '../components/dashboard/StatusDistributionChart';
import DepartmentDistributionChart from '../components/dashboard/DepartmentDistributionChart';
import SubmissionTimelineChart from '../components/dashboard/SubmissionTimelineChart';
import RecentIdeasTable from '../components/dashboard/RecentIdeasTable';

const Dashboard = () => {
  // Framer motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <Box component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Typography variant="h4" component={motion.h1} variants={itemVariants} gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Statistics Cards */}
      <SummaryCards />

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        {/* Idea Status Distribution */}
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <StatusDistributionChart />
        </Grid>

        {/* Ideas by Department */}
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <DepartmentDistributionChart />
        </Grid>

        {/* Idea Submission Timeline */}
        <Grid item xs={12} component={motion.div} variants={itemVariants} sx={{ width: '100%' }}>
          <SubmissionTimelineChart />
        </Grid>
      </Grid>

      {/* Recent Ideas Table */}
      <RecentIdeasTable />
    </Box>
  );
};

export default Dashboard;