import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import CreateTour from './pages/CreateTour';
import EditTour from './pages/EditTour';
import Login from './pages/Login';
import NoPage from './pages/NoPage';

// Protected route component
function RequireAuth({ children, requiredRole = null }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if a specific role is required
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    // User doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<TourList />} />
            <Route path="tours/:id" element={<TourDetail />} />
            <Route 
              path="tours/create" 
              element={
                <RequireAuth requiredRole="manager">
                  <CreateTour />
                </RequireAuth>
              } 
            />
            <Route 
              path="tours/edit/:id" 
              element={
                <RequireAuth requiredRole="manager">
                  <EditTour />
                </RequireAuth>
              } 
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </AuthProvider>
  );
}

export default App;
