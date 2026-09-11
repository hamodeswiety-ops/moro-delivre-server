import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { loadUser } from '@store/auth/authSlice'
import Navbar from '@components/layout/Navbar'
import Sidebar from '@components/layout/Sidebar'
import Footer from '@components/layout/Footer'
import ProtectedRoute from '@components/auth/ProtectedRoute'

// Pages
import LandingPage from '@pages/Landing'
import LoginPage from '@pages/Login'
import RegisterPage from '@pages/Register'
import DashboardPage from '@pages/Dashboard'
import ProjectsPage from '@pages/Projects'
import ProjectDetailPage from '@pages/ProjectDetail'
import DesignStudioPage from '@pages/DesignStudio'
import MaterialsPage from '@pages/Materials'
import PricingPage from '@pages/Pricing'
import ProfilePage from '@pages/Profile'
import NotFoundPage from '@pages/NotFound'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id/design"
                element={
                  <ProtectedRoute>
                    <DesignStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/materials"
                element={
                  <ProtectedRoute>
                    <MaterialsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <ProtectedRoute>
                    <PricingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  )
}
