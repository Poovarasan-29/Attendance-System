import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import Reports from './pages/Reports';
import TeamCalendar from './pages/TeamCalendar';
import AllEmployees from './pages/AllEmployees';
import PrivateRoute from './components/PrivateRoute';
import EmployeeLayout from './layouts/EmployeeLayout';
import ManagerLayout from './layouts/ManagerLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route element={<PrivateRoute allowedRoles={['employee']} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/my-history" element={<AttendanceHistory />} />
          </Route>
        </Route>

        {/* Manager Routes */}
        <Route element={<PrivateRoute allowedRoles={['manager']} />}>
          <Route element={<ManagerLayout />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/team-calendar" element={<TeamCalendar />} />
            <Route path="/all-employees" element={<AllEmployees />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
