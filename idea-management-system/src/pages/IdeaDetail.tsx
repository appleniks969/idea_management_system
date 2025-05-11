import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Idea, IdeaStatus, UserRole, Comment, CommentType } from '../types';
import { getIdeaById, updateIdea } from '../services/ideaService';

// Mock data for comments and users - in a real app, these would come from an API
// This is temporary until we have proper backend services
const mockUsers = [
  { id: 'user1', fullName: 'John Smith', email: 'john@example.com', role: UserRole.SUBMITTER },
  { id: 'user2', fullName: 'Jane Doe', email: 'jane@example.com', role: UserRole.APPROVER },
  { id: 'user3', fullName: 'Admin User', email: 'admin@example.com', role: UserRole.ADMINISTRATOR }
];

const mockComments: Comment[] = [
  { 
    id: 'comment1', 
    ideaId: 'idea1', 
    userId: 'user2', 
    commentText: 'This looks promising, but could you provide more details on the implementation?', 
    commentDate: '2023-01-15T10:30:00Z',
    commentType: CommentType.GENERAL
  }
];

// Helper function to get comments for an idea
const getCommentsForIdea = (ideaId: string): Comment[] => {
  return mockComments.filter(comment => comment.ideaId === ideaId);
};

// Helper function to get user by ID
const getUserById = (userId: string) => {
  return mockUsers.find(user => user.id === userId);
};

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

const IdeaDetail = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisionRequest, setRevisionRequest] = useState('');

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!ideaId) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const foundIdea = await getIdeaById(ideaId);
        if (foundIdea) {
          setIdea(foundIdea);
          setComments(getCommentsForIdea(ideaId));
        } else {
          // Idea not found, redirect to dashboard
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching idea details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [ideaId, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading idea details...</Typography>
      </Box>
    );
  }

  if (!idea) {
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

  const isApprover = currentUser?.role === UserRole.APPROVER || currentUser?.role === UserRole.ADMINISTRATOR;
  const submitter = getUserById(idea.submitterId);
  const approver = idea.assignedApproverId ? getUserById(idea.assignedApproverId) : null;

  const handleApprove = async () => {
    setOpenApproveDialog(false);
    
    if (!currentUser) return;
    
    try {
      // Update idea status
      const updatedIdea = await updateIdea(idea.id, { 
        status: IdeaStatus.APPROVED,
        assignedApproverId: currentUser.id
      });
      
      if (updatedIdea) {
        setIdea(updatedIdea);
        
        // Add a comment
        const newApprovalComment: Comment = {
          id: `temp-${Date.now()}`,
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: 'This idea has been approved.',
          commentDate: new Date().toISOString(),
          commentType: CommentType.GENERAL
        };
        
        setComments([...comments, newApprovalComment]);
      }
    } catch (error) {
      console.error('Error approving idea:', error);
    }
  };

  const handleReject = async () => {
    setOpenRejectDialog(false);
    
    if (!currentUser || !rejectionReason) return;
    
    try {
      // Update idea status
      const updatedIdea = await updateIdea(idea.id, { 
        status: IdeaStatus.REJECTED,
        assignedApproverId: currentUser.id
      });
      
      if (updatedIdea) {
        setIdea(updatedIdea);
        
        // Add a rejection comment
        const newRejectionComment: Comment = {
          id: `temp-${Date.now()}`,
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: rejectionReason,
          commentDate: new Date().toISOString(),
          commentType: CommentType.REJECTION_REASON
        };
        
        setComments([...comments, newRejectionComment]);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting idea:', error);
    }
  };

  const handleRequestRevision = async () => {
    setOpenRevisionDialog(false);
    
    if (!currentUser || !revisionRequest) return;
    
    try {
      // Update idea status
      const updatedIdea = await updateIdea(idea.id, { 
        status: IdeaStatus.REVISION_REQUESTED,
        assignedApproverId: currentUser.id
      });
      
      if (updatedIdea) {
        setIdea(updatedIdea);
        
        // Add a revision request comment
        const newRevisionComment: Comment = {
          id: `temp-${Date.now()}`,
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: revisionRequest,
          commentDate: new Date().toISOString(),
          commentType: CommentType.REVISION_REQUEST
        };
        
        setComments([...comments, newRevisionComment]);
        setRevisionRequest('');
      }
    } catch (error) {
      console.error('Error requesting revision:', error);
    }
  };

  const handleAddComment = () => {
    if (currentUser && newComment) {
      const comment: Comment = {
        id: `temp-${Date.now()}`,
        ideaId: idea.id,
        userId: currentUser.id,
        commentText: newComment,
        commentDate: new Date().toISOString(),
        commentType: CommentType.GENERAL
      };
      
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <Box>
      <Button 
        variant="outlined" 
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {idea.title}
              </Typography>
              <Chip 
                label={formatStatus(idea.status)} 
                color={getStatusColor(idea.status) as any}
                sx={{ fontSize: '1rem', px: 1 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                Submitted by: {submitter?.fullName || 'Unknown User'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                Submitted on: {new Date(idea.dateSubmitted).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                Category: {idea.category}
              </Typography>
            </Box>
          </Grid>

          {approver && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Assigned to: {approver.fullName}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {idea.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Expected Benefits
            </Typography>
            <Typography variant="body1" paragraph>
              {idea.benefits}
            </Typography>
          </Grid>

          {/* Approval Actions - Only visible to approvers */}
          {isApprover && idea.status !== IdeaStatus.APPROVED && idea.status !== IdeaStatus.REJECTED && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Approval Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => setOpenApproveDialog(true)}
                >
                  Approve
                </Button>
                <Button 
                  variant="contained" 
                  color="warning"
                  onClick={() => setOpenRevisionDialog(true)}
                >
                  Request Revisions
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => setOpenRejectDialog(true)}
                >
                  Reject
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Comments Section */}
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
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Comments list */}
        {comments.length > 0 ? (
          <List>
            {comments.map((comment) => {
              const commentUser = getUserById(comment.userId);
              const commentTypeColor = 
                comment.commentType === CommentType.REVISION_REQUEST 
                  ? 'warning.main'
                  : comment.commentType === CommentType.REJECTION_REASON
                    ? 'error.main'
                    : 'primary.main';
              
              return (
                <Card key={comment.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
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
            })}
          </List>
        ) : (
          <Typography variant="body1">No comments yet.</Typography>
        )}
      </Paper>

      {/* Approval Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
      >
        <DialogTitle>Approve Idea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this idea?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApprove} color="success" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
      >
        <DialogTitle>Reject Idea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this idea.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Revision Dialog */}
      <Dialog
        open={openRevisionDialog}
        onClose={() => setOpenRevisionDialog(false)}
      >
        <DialogTitle>Request Revisions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please specify what revisions are needed for this idea.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Revision Request"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={revisionRequest}
            onChange={(e) => setRevisionRequest(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRevisionDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRequestRevision} 
            color="warning" 
            variant="contained"
            disabled={!revisionRequest.trim()}
          >
            Request Revisions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdeaDetail;