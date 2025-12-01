import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import { LogIn, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '', // Can be email or employeeId
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            if (user.role === 'manager') {
                navigate('/manager-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email, // Backend will check if it's email or employeeId
            password,
        };
        dispatch(login(userData));
    };

    if (isLoading) {
        return (
            <>
                <Helmet>
                    <title>Loading...</title>
                </Helmet>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white text-lg font-medium">Logging you in...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Login | Attendance System</title>
            </Helmet>
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
                    <div className="w-full max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
                            {/* Left Side - Branding */}
                            <div className="flex-1 w-full text-center lg:text-left space-y-6 md:space-y-8">
                                <div className="inline-flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                                    <div className="px-4 py-2 md:px-5 md:py-3 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                                        <p className="text-xl md:text-2xl text-slate-300 font-bold">📙 Attendance System</p>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                                    Welcome
                                    <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                                        Back
                                    </span>
                                </h1>

                                <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    Sign in to access your dashboard and manage your attendance efficiently.
                                </p>

                                {/* Feature Pills */}
                                <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start pt-4">
                                    <div className="px-4 py-2 md:px-5 md:py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                                        <p className="text-xs md:text-sm text-slate-300 font-medium">⚡ Quick access</p>
                                    </div>
                                    <div className="px-4 py-2 md:px-5 md:py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                                        <p className="text-xs md:text-sm text-slate-300 font-medium">📊 Real-time stats</p>
                                    </div>
                                    <div className="px-4 py-2 md:px-5 md:py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                                        <p className="text-xs md:text-sm text-slate-300 font-medium">🔐 Secure login</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="flex-1 w-full max-w-xl">
                                <div className="relative group">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition duration-500"></div>

                                    {/* Form Container */}
                                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8">
                                        <div className='flex justify-center'>
                                            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 my-4 md:my-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg relative">
                                                <LogIn className="w-6 h-6 md:w-8 md:h-8 text-white absolute" />
                                            </div>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                                            Sign In
                                        </h2>
                                        <p className="text-slate-300 text-center mb-6 md:mb-8 text-sm md:text-base">
                                            Enter your credentials to continue
                                        </p>

                                        <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
                                            {/* Email or Employee ID */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-slate-200">
                                                    Email or Employee ID
                                                </label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        value={email}
                                                        onChange={onChange}
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                        placeholder="john@company.com or EMP001"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-slate-200">
                                                    Password
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={password}
                                                        onChange={onChange}
                                                        required
                                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-200"
                                            >
                                                Sign In
                                            </button>
                                        </form>

                                        {/* Register Link */}
                                        <div className="mt-6 text-center">
                                            <p className="text-slate-400 text-sm">
                                                Don't have an account?{' '}
                                                <Link
                                                    to="/register"
                                                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                                                >
                                                    Register
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
            </div>
        </>
    );
};

export default Login;
