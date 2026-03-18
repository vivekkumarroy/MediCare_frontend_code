import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { AppointmentsProvider } from '@/context/AppointmentsContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DrShyra } from '@/components/chatbot/DrShyra';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));
const PatientDashboard = lazy(() => import('@/pages/PatientDashboard'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const DoctorDashboard = lazy(() => import('@/pages/DoctorDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppointmentsProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/prescriptions"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/history"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/rating"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <BookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/patients"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/history"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/ratings"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/profile"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <DrShyra />
          </AppointmentsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
