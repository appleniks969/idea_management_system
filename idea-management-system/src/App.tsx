import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import './App.css';
import { useAuth } from './contexts/AuthContext';

// Import components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import IdeaSubmission from './pages/IdeaSubmission';
import IdeaDetail from './pages/IdeaDetail';
import ApprovalDashboard from './pages/ApprovalDashboard';
import Login from './pages/Login';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/submit" element={<IdeaSubmission />} />
              <Route path="/ideas/:ideaId" element={<IdeaDetail />} />
              <Route path="/approval" element={<ApprovalDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;