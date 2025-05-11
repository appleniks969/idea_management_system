import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { mockIdeas } from '../mockData';
import { useAuth } from '../contexts/AuthContext';
import { Idea, IdeaStatus, UserRole } from '../types';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ApprovalDashboard = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // In a real app, we would fetch ideas assigned to the current approver
    // For now, we'll use all ideas and filter to demonstrate the UI
    let ideasToShow = [...mockIdeas];
    
    // If user is an approver, only show ideas in their categories
    if (currentUser?.role === UserRole.APPROVER && currentUser.approvalCategories) {
      ideasToShow = ideasToShow.filter(
        idea => currentUser.approvalCategories?.includes(idea.category)
      );
    }
    
    setIdeas(ideasToShow);
    setFilteredIdeas(ideasToShow);
  }, [currentUser]);

  useEffect(() => {
    // Apply filters
    let filtered = [...ideas];
    
    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        idea => 
          idea.title.toLowerCase().includes(term) || 
          idea.description.toLowerCase().includes(term)
      );
    }
    
    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(idea => idea.category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(idea => idea.status === statusFilter);
    }
    
    setFilteredIdeas(filtered);
  }, [ideas, searchTerm, categoryFilter, statusFilter]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Categorize ideas by their status
  const pendingIdeas = filteredIdeas.filter(
    idea => idea.status === IdeaStatus.SUBMITTED || idea.status === IdeaStatus.UNDER_REVIEW
  );
  const approvedIdeas = filteredIdeas.filter(
    idea => idea.status === IdeaStatus.APPROVED
  );
  const rejectedIdeas = filteredIdeas.filter(
    idea => idea.status === IdeaStatus.REJECTED
  );
  const revisionRequestedIdeas = filteredIdeas.filter(
    idea => idea.status === IdeaStatus.REVISION_REQUESTED
  );

  // Get unique categories from ideas
  const categories = Array.from(new Set(ideas.map(idea => idea.category)));

  if (!currentUser || (currentUser.role !== UserRole.APPROVER && currentUser.role !== UserRole.ADMINISTRATOR)) {
    return (
      <Box>
        <Typography variant="h6">
          You don't have permission to access the approval dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Approval Dashboard
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                {Object.values(IdeaStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatStatus(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs and Tables */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="idea status tabs">
            <Tab label={`Pending Review (${pendingIdeas.length})`} />
            <Tab label={`Approved (${approvedIdeas.length})`} />
            <Tab label={`Revisions Requested (${revisionRequestedIdeas.length})`} />
            <Tab label={`Rejected (${rejectedIdeas.length})`} />
          </Tabs>
        </Box>

        {/* Pending Tab */}
        <TabPanel value={tabValue} index={0}>
          <IdeaTable ideas={pendingIdeas} />
        </TabPanel>

        {/* Approved Tab */}
        <TabPanel value={tabValue} index={1}>
          <IdeaTable ideas={approvedIdeas} />
        </TabPanel>

        {/* Revisions Requested Tab */}
        <TabPanel value={tabValue} index={2}>
          <IdeaTable ideas={revisionRequestedIdeas} />
        </TabPanel>

        {/* Rejected Tab */}
        <TabPanel value={tabValue} index={3}>
          <IdeaTable ideas={rejectedIdeas} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

// Table component for ideas
interface IdeaTableProps {
  ideas: Idea[];
}

const IdeaTable = ({ ideas }: IdeaTableProps) => {
  if (ideas.length === 0) {
    return <Typography sx={{ p: 2 }}>No ideas found.</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Submitted</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ideas.map((idea) => (
            <TableRow key={idea.id}>
              <TableCell>{idea.title}</TableCell>
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
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApprovalDashboard;