import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay = ({ message = 'Loading...' }: LoadingOverlayProps) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: '200px'
      }}
    >
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};

export default LoadingOverlay;