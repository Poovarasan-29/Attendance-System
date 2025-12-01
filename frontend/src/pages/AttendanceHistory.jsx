import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import axios from 'axios';

const AttendanceHistory = () => {
    const { user } = useSelector((state) => state.auth);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('calendar'); // 'calendar' or 'list'

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/attendance/my-history', config);
            setHistory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-500';
            case 'absent': return 'bg-red-500';
            case 'late': return 'bg-yellow-500';
            case 'half-day': return 'bg-orange-500';
            default: return 'bg-slate-700';
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 border border-white/5 rounded-lg opacity-50"></div>);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = history.find(h => h.date === dateStr);

            days.push(
                <div key={day} className="h-24 bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors relative group">
                    <span className="text-slate-300 font-medium">{day}</span>
                    {record && (
                        <div className="mt-2">
                            <div className={`text-xs px-2 py-1 rounded-md text-white font-medium mb-1 ${getStatusColor(record.status)}`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {record.totalHours || 0}h
                            </div>
                        </div>
                    )}
                    {/* Tooltip for details */}
                    {record && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            <p className="text-xs text-slate-300 mb-1">Check In: {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</p>
                            <p className="text-xs text-slate-300">Check Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</p>
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Attendance History</h1>

                <div className="flex bg-white/10 p-1 rounded-xl">
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        List View
                    </button>
                </div>
            </div>

            {view === 'calendar' ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-slate-400 font-medium text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-4">
                        {renderCalendar()}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-300">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-slate-300">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-slate-300">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-slate-300">Half Day</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Date</th>
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Check In</th>
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Check Out</th>
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Status</th>
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Total Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((record) => (
                                    <tr key={record._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-sm text-white">
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-300">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-300">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(record.status)}`}>
                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-300">
                                            {record.totalHours || 0} hrs
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
