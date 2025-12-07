import { useSelector } from 'react-redux';
import { useGetManagerStatsQuery } from '../store/apiSlice';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const ManagerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: stats, isLoading } = useGetManagerStatsQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isLoading) return <div className="text-center mt-20 text-slate-400">Loading dashboard...</div>;

    // Department Wise Data (Present count per department)
    const departmentData = stats?.departmentStats?.map(dept => ({
        name: dept.department,
        value: dept.present
    })) || [];

    const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="heading text-2xl sm:text-3xl">
                    Manager Dashboard <span className="block sm:inline text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">{user?.name}</span>
                </h1>
                <p className="text-slate-400 mt-1 text-sm sm:text-base">Here's your attendance overview for this month.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="card flex items-center gap-4 p-4">
                    <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-500 shrink-0">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Total Employees</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalEmployees || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 p-4">
                    <div className="p-3 rounded-lg bg-green-500/20 text-green-500 shrink-0">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Present Today</p>
                        <p className="text-2xl font-bold text-white">{stats?.todayStats?.present || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 p-4">
                    <div className="p-3 rounded-lg bg-red-500/20 text-red-500 shrink-0">
                        <UserX size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Absent Today</p>
                        <p className="text-2xl font-bold text-white">{stats?.todayStats?.absent || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 p-4">
                    <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500 shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Late Arrivals</p>
                        <p className="text-2xl font-bold text-white">{stats?.todayStats?.late || 0}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* Weekly Attendance Trend */}
                <div className="card h-80 sm:h-96 p-4 sm:p-6">
                    <h3 className="text-lg font-bold mb-4 sm:mb-6 text-white">Weekly Attendance Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats?.weeklyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Present" />
                            <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Absent" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Wise */}
                <div className="card h-80 sm:h-96 p-4 sm:p-6">
                    <h3 className="text-lg font-bold mb-4 sm:mb-6 text-white">Department Wise</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={departmentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lists Section */}
            <div className="space-y-6 sm:space-y-8">
                {/* Absent Employees List */}
                <div className="card p-4 sm:p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <UserX className="text-red-500" size={20} />
                        Absent Employees Today
                    </h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">ID</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Name</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Department</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats?.absentEmployees?.length > 0 ? (
                                        stats.absentEmployees.map((emp) => (
                                            <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.employeeId}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-white font-medium whitespace-nowrap">{emp.name}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.department}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.email}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-6 text-center text-slate-500 text-sm">All employees present</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Late Arrivals List */}
                <div className="card p-4 sm:p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <Clock className="text-yellow-500" size={20} />
                        Late Arrivals Today
                    </h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">ID</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Name</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Department</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Email</th>
                                        <th className="py-3 px-4 text-xs sm:text-sm font-medium text-slate-400 whitespace-nowrap">Check In</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats?.lateEmployees?.length > 0 ? (
                                        stats.lateEmployees.map((emp) => (
                                            <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.employeeId}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-white font-medium whitespace-nowrap">{emp.name}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.department}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">{emp.email || '-'}</td>
                                                <td className="py-3 px-4 text-xs sm:text-sm text-yellow-500 font-medium whitespace-nowrap">
                                                    {new Date(emp.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-slate-500 text-sm">No late arrivals today</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
