import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HealthDashboard from './pages/HealthDashboard';
import WeightLossDashboard from './pages/WeightLossDashboard';
import CommunityDashboard from './pages/CommunityDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Import CSS
import './styles/index.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/health" element={<HealthDashboard />} />
                        <Route path="/weight-loss" element={<WeightLossDashboard />} />
                        <Route path="/community" element={<CommunityDashboard />} />
                      </Routes>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;