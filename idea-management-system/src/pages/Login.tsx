import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { UserRole } from '../types';
import { mockLogin } from '../contexts/AuthContext';

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For quick login in the demo app
  const [quickLoginRole, setQuickLoginRole] = useState<UserRole>(UserRole.SUBMITTER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const success = await login(username, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    try {
      setError('');
      setLoading(true);
      // Use the mock login function for quick access
      await mockLogin(quickLoginRole);
      // Reload the page to ensure the auth state is updated
      window.location.href = '/';
    } catch (err) {
      setError('An error occurred during quick login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setQuickLoginRole(event.target.value as UserRole);
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h5">
            Idea Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
            Sign In
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign In
            </Button>
          </Box>

          <Divider />

          <Box sx={{ mt: 3, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Login (Demo Only)
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">User Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={quickLoginRole}
                label="User Role"
                onChange={handleRoleChange}
              >
                <MenuItem value={UserRole.SUBMITTER}>Submitter</MenuItem>
                <MenuItem value={UserRole.APPROVER}>Approver</MenuItem>
                <MenuItem value={UserRole.ADMINISTRATOR}>Administrator</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleQuickLogin}
              disabled={loading}
            >
              Quick Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

const Divider = () => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      my: 3,
      '&::before, &::after': {
        content: '""',
        flexGrow: 1,
        backgroundColor: 'divider',
        height: '1px'
      },
      '& > span': {
        mx: 2
      }
    }}
  >
    <Typography variant="body2" color="text.secondary">
      OR
    </Typography>
  </Box>
);

export default Login;