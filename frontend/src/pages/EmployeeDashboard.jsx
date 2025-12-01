import { useSelector } from 'react-redux';
import {
    useGetMySummaryQuery,
    useGetTodayStatusQuery,
    useCheckInMutation,
    useCheckOutMutation
} from '../store/apiSlice';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EmployeeDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // RTK Query Hooks
    const { data: summary, isLoading: isSummaryLoading } = useGetMySummaryQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: todayStatus, isLoading: isStatusLoading } = useGetTodayStatusQuery(undefined, { refetchOnMountOrArgChange: true });

    const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
    const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

    const handleCheckIn = async () => {
        try {
            await checkIn().unwrap();
        } catch (err) {
            console.error('Failed to check in:', err);
            alert(err.data?.message || 'Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        try {
            await checkOut().unwrap();
        } catch (err) {
            console.error('Failed to check out:', err);
            alert(err.data?.message || 'Failed to check out');
        }
    };

    const isCheckedIn = todayStatus?.checkInTime && !todayStatus?.checkOutTime;
    const isCheckedOut = todayStatus?.checkOutTime;
    const hasNotCheckedIn = !todayStatus?.checkInTime;

    if (isSummaryLoading || isStatusLoading) {
        return <div className="text-center mt-20">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="heading">Welcome back, {user?.name}</h1>
                <p className="text-gray-400">Here's your attendance overview for this month.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/20 text-green-500">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Present Days</p>
                        <p className="text-2xl font-bold">{summary?.present || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-red-500/20 text-red-500">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Absent Days</p>
                        <p className="text-2xl font-bold">{summary?.absent || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Late Days</p>
                        <p className="text-2xl font-bold">{summary?.late || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Hours</p>
                        <p className="text-2xl font-bold">{summary?.totalHours?.toFixed(1) || 0}</p>
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <div className="card max-w-xl mx-auto text-center py-10">
                <h2 className="text-xl font-bold mb-6">Today's Action</h2>
                <div className="flex justify-center gap-4">
                    {hasNotCheckedIn && (
                        <button
                            onClick={handleCheckIn}
                            disabled={isCheckingIn}
                            className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                        >
                            <CheckCircle size={24} /> {isCheckingIn ? 'Checking In...' : 'Check In'}
                        </button>
                    )}
                    {isCheckedIn && (
                        <button
                            onClick={handleCheckOut}
                            disabled={isCheckingOut}
                            className="btn bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                        >
                            <LogOutIcon size={24} /> {isCheckingOut ? 'Checking Out...' : 'Check Out'}
                        </button>
                    )}
                    {isCheckedOut && (
                        <div className="text-green-500 flex flex-col items-center gap-2">
                            <CheckCircle size={48} />
                            <p className="text-lg font-medium">You have completed your day!</p>
                        </div>
                    )}
                </div>
                <div className="mt-8 text-gray-400 text-sm">
                    <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
                    {todayStatus?.checkInTime && <p>Check In: {new Date(todayStatus.checkInTime).toLocaleTimeString()}</p>}
                    {todayStatus?.checkOutTime && <p>Check Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}</p>}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-6 text-sm font-medium text-slate-400">Date</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-400">Check In</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-400">Check Out</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-400">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {summary?.recentAttendance?.length > 0 ? (
                                summary.recentAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {new Date(record.date).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${record.status === 'present' ? 'bg-green-500/10 text-green-400' :
                                                    record.status === 'late' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        record.status === 'half-day' ? 'bg-orange-500/10 text-orange-400' :
                                                            'bg-red-500/10 text-red-400'}`}>
                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {record.totalHours ? record.totalHours.toFixed(2) : 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        No recent activity
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

// Helper icon
const LogOutIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

export default EmployeeDashboard;
