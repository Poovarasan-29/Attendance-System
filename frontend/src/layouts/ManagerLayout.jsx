import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import { LogOut, Users, BarChart2, Home, Menu, X } from 'lucide-react';
import ProfileHoverCard from '../components/ProfileHoverCard';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const ManagerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/manager-dashboard', icon: Home, label: 'Dashboard' },
        { path: '/team-calendar', icon: Users, label: 'Team Calendar' },
        { path: '/all-employees', icon: Users, label: 'All Employees' },
        { path: '/reports', icon: BarChart2, label: 'Reports' },
    ];

    return (
        <>
            <Helmet>
                <title>Dashboard {user.name ? `- ${user.name}` : ""} </title>
            </Helmet>
            <div className="min-h-screen flex flex-col bg-slate-950">
                <nav className="glass sticky top-0 z-50 border-b border-white/10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-cyan-400">
                                    AttendanceSys <span className="hidden sm:inline-block text-xs text-slate-400 font-normal border border-slate-700 rounded px-2 py-0.5 ml-2">Manager</span>
                                </h1>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive(link.path)
                                                ? 'text-white'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        <link.icon size={18} /> {link.label}
                                    </Link>
                                ))}

                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                                    <ProfileHoverCard user={user} />
                                    <button
                                        onClick={onLogout}
                                        className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="md:hidden flex items-center gap-4">
                                <ProfileHoverCard user={user} />
                                <button
                                    onClick={toggleMobileMenu}
                                    className="text-slate-300 hover:text-white p-2"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl absolute w-full left-0">
                            <div className="px-4 pt-2 pb-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.path)
                                                ? 'bg-white/10 text-white'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <link.icon size={20} /> {link.label}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        closeMobileMenu();
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2"
                                >
                                    <LogOut size={20} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default ManagerLayout;
