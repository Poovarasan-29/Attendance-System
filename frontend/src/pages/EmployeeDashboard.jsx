import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, LogIn, LogOut, History } from 'lucide-react';
import axios from 'axios';

const EmployeeDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/dashboard/employee', config);
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setCheckInLoading(true);
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(import.meta.env.VITE_API_BASE_URL + '/attendance/checkin', {}, config);
            await fetchDashboardData(); // Refresh data
            setCheckInLoading(false);
        } catch (error) {
            console.error('Error checking in:', error);
            alert(error.response?.data?.message || 'Error checking in');
            setCheckInLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setCheckInLoading(true);
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(import.meta.env.VITE_API_BASE_URL + '/attendance/checkout', {}, config);
            await fetchDashboardData(); // Refresh data
            setCheckInLoading(false);
        } catch (error) {
            console.error('Error checking out:', error);
            alert(error.response?.data?.message || 'Error checking out');
            setCheckInLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const todayStatus = stats?.todayStatus?.status || 'not-marked';
    const isCheckedIn = todayStatus === 'present' || todayStatus === 'late';
    const isCheckedOut = stats?.todayStatus?.checkOutTime;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.name}</span>
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">Here's your attendance overview for this month</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {!isCheckedOut && (
                        !isCheckedIn ? (
                            <button
                                onClick={handleCheckIn}
                                disabled={checkInLoading}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {checkInLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <LogIn className="w-5 h-5" />
                                )}
                                <span>Check In Now</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckOut}
                                disabled={checkInLoading}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {checkInLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <LogOut className="w-5 h-5" />
                                )}
                                <span>Check Out</span>
                            </button>
                        )
                    )}
                    {isCheckedOut && (
                        <div className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl border border-slate-600">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span>Completed for Today</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Present Days */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-2">Present Days</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">{stats?.present || 0}</h3>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Absent Days */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-2">Absent Days</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">{stats?.absent || 0}</h3>
                        </div>
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <XCircle className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Late Arrivals */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-2">Late Arrivals</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">{stats?.late || 0}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-xl">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Total Hours */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-2">Total Hours</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">{stats?.totalHours || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" />
                        Recent Activity
                    </h2>
                    <button
                        onClick={() => navigate('/my-history')}
                        className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                        View All History
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-3 md:py-4 px-3 md:px-4 text-sm font-medium text-slate-400">Date</th>
                                <th className="py-3 md:py-4 px-3 md:px-4 text-sm font-medium text-slate-400">Check In</th>
                                <th className="py-3 md:py-4 px-3 md:px-4 text-sm font-medium text-slate-400">Check Out</th>
                                <th className="py-3 md:py-4 px-3 md:px-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="py-3 md:py-4 px-3 md:px-4 text-sm font-medium text-slate-400">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.recentAttendance?.length > 0 ? (
                                stats.recentAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 md:py-4 px-3 md:px-4 text-sm text-white">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-3 md:py-4 px-3 md:px-4 text-sm text-slate-300">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-3 md:py-4 px-3 md:px-4 text-sm text-slate-300">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-3 md:py-4 px-3 md:px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${record.status === 'present' ? 'bg-green-500/10 text-green-400' :
                                                    record.status === 'late' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        record.status === 'half-day' ? 'bg-orange-500/10 text-orange-400' :
                                                            'bg-red-500/10 text-red-400'}`}>
                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 md:py-4 px-3 md:px-4 text-sm text-slate-300">
                                            {record.totalHours || 0} hrs
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        No recent activity found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
