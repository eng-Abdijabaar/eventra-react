import { BrowserRouter as Router, Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage'
import { Show, SignInButton, UserButton } from "@clerk/react";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SsoCallback from './components/SsoCallback';
import PublicRoute from './components/PublicRoute';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* public routes */}
          <Route
            path="/login/*"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/sso-callback"
            element={
              <PublicRoute >
                <SsoCallback />
              </PublicRoute>
            }
          />


          {/* protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>}
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <div>Friends Page</div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App