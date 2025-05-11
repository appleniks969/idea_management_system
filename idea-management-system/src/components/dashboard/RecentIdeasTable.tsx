import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useIdeas } from '../../hooks/useIdeas';
import { StatusChip } from '../common/StatusChip';

const RecentIdeasTable = () => {
  const { data: ideas = [], isLoading, error } = useIdeas();
  
  // Get the most recent 5 ideas
  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
    .slice(0, 5);

  // Animation variants
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
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Recent Ideas</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Recent Ideas</Typography>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Error loading recent ideas</Typography>
        </Paper>
      </Box>
    );
  }

  return (
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
            {recentIdeas.length > 0 ? (
              recentIdeas.map((idea, index) => (
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
                    <StatusChip status={idea.status} />
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" py={2}>
                    No ideas found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentIdeasTable;