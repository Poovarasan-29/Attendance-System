import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, TrendingUp, Download } from 'lucide-react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ManagerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
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
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/dashboard/manager', config);
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Chart Data Preparation
    const weeklyTrendData = {
        labels: stats?.weeklyTrend?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
        datasets: [
            {
                label: 'Present',
                data: stats?.weeklyTrend?.map(d => d.present) || [],
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Absent',
                data: stats?.weeklyTrend?.map(d => d.absent) || [],
                borderColor: '#f87171',
                backgroundColor: 'rgba(248, 113, 113, 0.5)',
                tension: 0.4,
            },
            {
                label: 'Late',
                data: stats?.weeklyTrend?.map(d => d.late) || [],
                borderColor: '#facc15',
                backgroundColor: 'rgba(250, 204, 21, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const departmentData = {
        labels: stats?.departmentStats?.map(d => d.department) || [],
        datasets: [
            {
                data: stats?.departmentStats?.map(d => d.present) || [],
                backgroundColor: [
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8' }
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: {
                    color: '#94a3b8',
                    stepSize: 1,
                    precision: 0
                },
                beginAtZero: true
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white"><span className="me-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.name}'s </span>Dashboard</h1>
                    <p className="text-slate-400 mt-1">Overview of your team's performance</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/reports')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export Reports
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Employees</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalEmployees || 0}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Present Today</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.todayStats?.present || 0}</h3>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <UserCheck className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Absent Today</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.todayStats?.absent || 0}</h3>
                        </div>
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <UserX className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Late Arrivals</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats?.todayStats?.late || 0}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-xl">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Trend */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Weekly Attendance Trend
                    </h2>
                    <div className="h-[300px]">
                        <Line options={chartOptions} data={weeklyTrendData} />
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Department Wise</h2>
                    <div className="h-[300px] flex items-center justify-center">
                        <Doughnut
                            data={departmentData}
                            options={{
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { color: '#94a3b8' }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Absent Employees List */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <UserX className="w-5 h-5 text-red-400" />
                    Absent Employees Today
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Employee ID</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Name</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Department</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.absentEmployees?.length > 0 ? (
                                stats.absentEmployees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-sm text-slate-300">{emp.employeeId}</td>
                                        <td className="py-4 px-4 text-sm text-white font-medium">{emp.name}</td>
                                        <td className="py-4 px-4 text-sm text-slate-300">{emp.department}</td>
                                        <td className="py-4 px-4 text-sm text-slate-300">{emp.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-500">
                                        No employees absent today! 🎉
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

export default ManagerDashboard;
