import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useDashboardMetrics } from '../../hooks/useDashboard';
import { IdeaStatus } from '../../types';

const SummaryCards = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  // Animation variants
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

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    );
  }

  if (error || !metrics) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography color="error" align="center">
            Error loading dashboard metrics
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }} component={motion.div} variants={containerVariants}>
      <Grid item xs={12} md={3} component={motion.div} variants={itemVariants}>
        <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Ideas
            </Typography>
            <Typography variant="h4">{metrics.totalIdeas}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} component={motion.div} variants={itemVariants}>
        <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Approved Ideas
            </Typography>
            <Typography variant="h4">
              {metrics.byStatus[IdeaStatus.APPROVED]}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} component={motion.div} variants={itemVariants}>
        <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Under Review
            </Typography>
            <Typography variant="h4">
              {metrics.byStatus[IdeaStatus.UNDER_REVIEW]}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} component={motion.div} variants={itemVariants}>
        <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              New Submissions
            </Typography>
            <Typography variant="h4">
              {metrics.byStatus[IdeaStatus.SUBMITTED]}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;