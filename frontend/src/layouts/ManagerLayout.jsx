import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import { LogOut, Users, BarChart2, Home } from 'lucide-react';
import ProfileHoverCard from '../components/ProfileHoverCard';

const ManagerLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                        AttendanceSys <span className="text-xs text-gray-500 font-normal border border-gray-700 rounded px-2 py-0.5 ml-2">Manager</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/manager-dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/team-calendar" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Users size={20} /> Team Calendar
                    </Link>
                    <Link to="/all-employees" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Users size={20} /> All Employees
                    </Link>
                    <Link to="/reports" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <BarChart2 size={20} /> Reports
                    </Link>
                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                        <ProfileHoverCard user={user} />
                        <button onClick={onLogout} className="text-gray-400 hover:text-danger transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>
            <main className="flex-1 page-container py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;
