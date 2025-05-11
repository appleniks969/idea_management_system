import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { useIdea } from '../hooks/useIdeas';
import IdeaHeader from '../components/idea/IdeaHeader';
import CommentSection from '../components/idea/CommentSection';
import ApprovalActions from '../components/idea/ApprovalActions';

const IdeaDetail = () => {
  const { ideaId = '' } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { data: idea, isLoading, error } = useIdea(ideaId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading idea details...</Typography>
      </Box>
    );
  }

  if (error || !idea) {
    return (
      <Box>
        <Typography variant="h6">Idea not found</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* Idea Header Information */}
      <IdeaHeader idea={idea} />

      {/* Approval Actions Section */}
      <ApprovalActions idea={idea} />

      {/* Comments Section */}
      <CommentSection ideaId={idea.id} />
    </Box>
  );
};

export default IdeaDetail;