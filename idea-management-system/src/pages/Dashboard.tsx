import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Button,
  useTheme,
  Tooltip as MuiTooltip,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
  LineChart,
  Line,
  ZAxis,
  PieChart,
  Pie,
  Sector
} from 'recharts';
import { motion } from 'framer-motion';
import {
  getStatusDistributionData,
  getDepartmentDistributionData,
  getIdeaSubmissionTimelineData,
  mockIdeas
} from '../mockData';
import { IdeaStatus, Idea, ImpactLevel, EffortLevel } from '../types';

// Helper function to get color for status chips
const getStatusColor = (status: IdeaStatus) => {
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
const formatStatus = (status: IdeaStatus) => {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const Dashboard = () => {
  const theme = useTheme();
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
  const [statusDistributionData, setStatusDistributionData] = useState<any[]>([]);
  const [departmentDistributionData, setDepartmentDistributionData] = useState<any[]>([]);
  const [submissionTimelineData, setSubmissionTimelineData] = useState<any[]>([]);

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

  // Status-based colors for scatter plot
  const STATUS_COLORS = {
    [IdeaStatus.APPROVED]: theme.palette.success.main,
    [IdeaStatus.UNDER_REVIEW]: theme.palette.info.main,
    [IdeaStatus.SUBMITTED]: theme.palette.primary.main,
    [IdeaStatus.REVISION_REQUESTED]: theme.palette.warning.main,
    [IdeaStatus.REJECTED]: theme.palette.error.main
  };

  useEffect(() => {
    // Load dashboard data
    const fetchDashboardData = () => {
      // Get the most recent 5 ideas
      const sortedIdeas = [...mockIdeas].sort(
        (a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
      ).slice(0, 5);

      setRecentIdeas(sortedIdeas);
      setStatusDistributionData(getStatusDistributionData());
      setDepartmentDistributionData(getDepartmentDistributionData());
      setSubmissionTimelineData(getIdeaSubmissionTimelineData());
    };

    fetchDashboardData();
  }, []);

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Typography variant="h4" component={motion.h1} variants={itemVariants} gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }} component={motion.div} variants={containerVariants}>
        <Grid item xs={12} md={3} component={motion.div} variants={itemVariants}>
          <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ideas
              </Typography>
              <Typography variant="h4">{mockIdeas.length}</Typography>
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
                {mockIdeas.filter(idea => idea.status === IdeaStatus.APPROVED).length}
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
                {mockIdeas.filter(idea => idea.status === IdeaStatus.UNDER_REVIEW).length}
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
                {mockIdeas.filter(idea => idea.status === IdeaStatus.SUBMITTED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        {/* Idea Status Distribution */}
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
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
                        fill={status ? STATUS_COLORS[status] : COLORS[index % COLORS.length]}
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
                            Percentage: {((data.value / mockIdeas.length) * 100).toFixed(1)}%
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
              {statusDistributionData.map((entry, index) => {
                const status = Object.values(IdeaStatus).find(
                  status => formatStatus(status) === entry.name
                ) as IdeaStatus;
                return (
                  <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mx: 1, mb: 1 }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: status ? STATUS_COLORS[status] : COLORS[index % COLORS.length],
                      mr: 0.5
                    }} />
                    <Typography variant="caption">{entry.name}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Ideas by Department */}
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
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
                            Percentage: {((data.value / mockIdeas.length) * 100).toFixed(1)}%
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
        </Grid>

        {/* Idea Submission Timeline */}
        <Grid item xs={12} component={motion.div} variants={itemVariants} sx={{ width: '100%' }}>
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
        </Grid>

      </Grid>

      {/* Recent Ideas Table */}
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Recent Ideas</Typography>
          <Button
            variant="contained"
            component={Link}
            to="/submit"
            color="primary"
            startIcon={<motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>+</motion.div>}
          >
            Submit New Idea
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            overflow: 'hidden',
            boxShadow: 2
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentIdeas.map((idea, index) => (
                <TableRow
                  key={idea.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                >
                  <TableCell component="th" scope="row">
                    {idea.title}
                  </TableCell>
                  <TableCell>{idea.category}</TableCell>
                  <TableCell>
                    {new Date(idea.dateSubmitted).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(idea.status)}
                      color={getStatusColor(idea.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/ideas/${idea.id}`}
                      color="primary"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;