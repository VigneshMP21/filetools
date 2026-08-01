import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import EmailVerificationPage from '../pages/auth/EmailVerificationPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import DashboardFilesPage from '../pages/dashboard/DashboardFilesPage'
import DashboardUploadPage from '../pages/dashboard/DashboardUploadPage'
import DashboardSettingsPage from '../pages/dashboard/DashboardSettingsPage'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import DashboardLayout from '../components/layout/DashboardLayout'
import PdfToWordPage from '../pdf-tools/pdf-to-word'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={
        <>
          <Navbar />
          <HomePage />
          <Footer />
        </>
      } />

      {/* Tools */}
      <Route path="/tools/pdf-to-word" element={
        <>
          <Navbar />
          <PdfToWordPage />
          <Footer />
        </>
      } />

      {/* Auth pages */}
      <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/auth/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/auth/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/auth/verify-email" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="files" element={<DashboardFilesPage />} />
        <Route path="upload" element={<DashboardUploadPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
