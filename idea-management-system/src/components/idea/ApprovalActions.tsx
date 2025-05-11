import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import { Idea, IdeaStatus, CommentType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateIdea } from '../../hooks/useIdeas';
import { useAddComment } from '../../hooks/useComments';

interface ApprovalActionsProps {
  idea: Idea;
}

const ApprovalActions = ({ idea }: ApprovalActionsProps) => {
  const { currentUser } = useAuth();
  const updateIdeaMutation = useUpdateIdea();
  const addCommentMutation = useAddComment();
  
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisionRequest, setRevisionRequest] = useState('');

  // Only show approval actions for approvers and ideas that aren't already approved or rejected
  const shouldShowActions = 
    currentUser?.role === 'approver' || currentUser?.role === 'administrator';
  
  const isActionable = 
    idea.status !== IdeaStatus.APPROVED && 
    idea.status !== IdeaStatus.REJECTED;

  if (!shouldShowActions || !isActionable) {
    return null;
  }

  const handleApprove = async () => {
    setOpenApproveDialog(false);
    
    if (!currentUser) return;
    
    // Update idea status
    updateIdeaMutation.mutate({
      id: idea.id, 
      data: { 
        status: IdeaStatus.APPROVED,
        assignedApproverId: currentUser.id
      }
    }, {
      onSuccess: () => {
        // Add a comment
        addCommentMutation.mutate({
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: 'This idea has been approved.',
          commentType: CommentType.GENERAL
        });
      }
    });
  };

  const handleReject = async () => {
    setOpenRejectDialog(false);
    
    if (!currentUser || !rejectionReason) return;
    
    // Update idea status
    updateIdeaMutation.mutate({
      id: idea.id,
      data: { 
        status: IdeaStatus.REJECTED,
        assignedApproverId: currentUser.id
      }
    }, {
      onSuccess: () => {
        // Add a rejection comment
        addCommentMutation.mutate({
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: rejectionReason,
          commentType: CommentType.REJECTION_REASON
        });
        
        setRejectionReason('');
      }
    });
  };

  const handleRequestRevision = async () => {
    setOpenRevisionDialog(false);
    
    if (!currentUser || !revisionRequest) return;
    
    // Update idea status
    updateIdeaMutation.mutate({
      id: idea.id,
      data: { 
        status: IdeaStatus.REVISION_REQUESTED,
        assignedApproverId: currentUser.id
      }
    }, {
      onSuccess: () => {
        // Add a revision request comment
        addCommentMutation.mutate({
          ideaId: idea.id,
          userId: currentUser.id,
          commentText: revisionRequest,
          commentType: CommentType.REVISION_REQUEST
        });
        
        setRevisionRequest('');
      }
    });
  };

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Approval Actions
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="success"
          onClick={() => setOpenApproveDialog(true)}
          disabled={updateIdeaMutation.isPending}
        >
          Approve
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={() => setOpenRevisionDialog(true)}
          disabled={updateIdeaMutation.isPending}
        >
          Request Revisions
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => setOpenRejectDialog(true)}
          disabled={updateIdeaMutation.isPending}
        >
          Reject
        </Button>
      </Box>

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
    </>
  );
};

export default ApprovalActions;