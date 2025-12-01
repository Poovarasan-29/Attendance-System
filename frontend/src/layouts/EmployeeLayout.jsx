import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import { LogOut, Calendar, Home } from 'lucide-react';
import ProfileHoverCard from '../components/ProfileHoverCard';

const EmployeeLayout = () => {
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
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        AttendanceSys
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/employee-dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/my-history" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Calendar size={20} /> History
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

export default EmployeeLayout;
