import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import CompanyProfile from './components/CompanyProfile'
import AdminDashboard from './components/admin/AdminDashboard'
import EnhancedAdminDashboard from './components/admin/EnhancedAdminDashboard'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import EditJob from './components/admin/EditJob'
import Applicants from './components/admin/Applicants'
import AllApplicantsPage from './components/admin/AllApplicantsPage'
import AnalyticsPage from './components/admin/AnalyticsPage'
import AdminSettings from './components/admin/AdminSettings'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLogin from './components/admin/AdminLogin'
import AdminPlatformDashboard from './components/admin/AdminPlatformDashboard'
import UsersManagement from './components/admin/UsersManagement'
import JobsManagement from './components/admin/JobsManagement'
import CompaniesManagement from './components/admin/CompaniesManagement'
import ApplicationsManagement from './components/admin/ApplicationsManagement'
import AnalyticsManagement from './components/admin/AnalyticsManagement'
import ReportsManagement from './components/admin/ReportsManagement'
import AdminSettingsPage from './components/admin/AdminSettingsPage'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import ErrorBoundary from './components/ErrorBoundary'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/company/:id",
    element: <CompanyProfile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>
  },
  {
    path:"/admin/dashboard/enhanced",
    element: <ProtectedRoute><EnhancedAdminDashboard/></ProtectedRoute>
  },
  {
    path:"/admin/analytics",
    element: <ProtectedRoute><AnalyticsPage/></ProtectedRoute>
  },
  {
    path:"/admin/all-applicants",
    element: <ProtectedRoute><AllApplicantsPage/></ProtectedRoute>
  },
  {
    path:"/admin/settings",
    element: <ProtectedRoute><AdminSettings/></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/edit",
    element:<ProtectedRoute><EditJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  // ===== ADMIN PORTAL ROUTES (SEPARATE FROM RECRUITER PORTAL) =====
  {
    path: '/admin-login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute><AdminPlatformDashboard /></ProtectedAdminRoute>
  },
  {
    path: '/admin/users',
    element: <ProtectedAdminRoute><UsersManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/jobs-management',
    element: <ProtectedAdminRoute><JobsManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/companies-management',
    element: <ProtectedAdminRoute><CompaniesManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/applications-management',
    element: <ProtectedAdminRoute><ApplicationsManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/analytics-management',
    element: <ProtectedAdminRoute><AnalyticsManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/reports',
    element: <ProtectedAdminRoute><ReportsManagement /></ProtectedAdminRoute>
  },
  {
    path: '/admin/settings',
    element: <ProtectedAdminRoute><AdminSettingsPage /></ProtectedAdminRoute>
  },

])
function App() {

  return (
    <ErrorBoundary>
      <RouterProvider router={appRouter} />
    </ErrorBoundary>
  )
}

export default App
