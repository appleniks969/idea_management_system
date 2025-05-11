import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Comment as CommentIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Comment, CommentType } from '../../types';
import { useCommentsByIdeaId, useAddComment } from '../../hooks/useComments';
import { useUser } from '../../hooks/useUsers';

interface CommentSectionProps {
  ideaId: string;
}

const CommentSection = ({ ideaId }: CommentSectionProps) => {
  const { currentUser } = useAuth();
  const { data: comments = [], isLoading: loadingComments } = useCommentsByIdeaId(ideaId);
  const addCommentMutation = useAddComment();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (currentUser && newComment.trim()) {
      addCommentMutation.mutate({
        ideaId,
        userId: currentUser.id,
        commentText: newComment,
        commentType: CommentType.GENERAL
      }, {
        onSuccess: () => {
          setNewComment('');
        }
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        <CommentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Comments
      </Typography>

      {/* Add a comment */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Add a comment"
          multiline
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!newComment.trim() || addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Comments list */}
      {loadingComments ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </List>
      ) : (
        <Typography variant="body1">No comments yet.</Typography>
      )}
    </Paper>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { data: commentUser } = useUser(comment.userId);
  
  const commentTypeColor = comment.commentType === CommentType.REVISION_REQUEST 
    ? 'warning.main'
    : comment.commentType === CommentType.REJECTION_REASON
      ? 'error.main'
      : 'primary.main';
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {commentUser?.fullName || 'Unknown User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(comment.commentDate).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        
        {comment.commentType !== CommentType.GENERAL && (
          <Chip 
            label={comment.commentType === CommentType.REVISION_REQUEST 
              ? 'Revision Request' 
              : 'Rejection Reason'
            }
            size="small"
            sx={{ 
              mb: 1, 
              bgcolor: commentTypeColor,
              color: 'white'
            }}
          />
        )}
        
        <Typography variant="body1">
          {comment.commentText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CommentSection;