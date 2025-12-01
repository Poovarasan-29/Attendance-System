import { useState } from 'react';
import { useGetMyHistoryQuery } from '../store/apiSlice';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List as ListIcon, Clock } from 'lucide-react';

const AttendanceHistory = () => {
    const { data: attendanceHistory, isLoading } = useGetMyHistoryQuery(undefined, { refetchOnMountOrArgChange: true });
    const [viewMode, setViewMode] = useState('calendar'); // 'list' | 'calendar'
    const [currentDate, setCurrentDate] = useState(new Date());

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

    const getStatusBadge = (record) => {
        if (!record) return null;

        const colors = {
            present: 'bg-green-500/20 text-green-500',
            absent: 'bg-red-500/20 text-red-500',
            late: 'bg-yellow-500/20 text-yellow-500',
            'half-day': 'bg-orange-500/20 text-orange-500'
        };

        const colorClass = colors[record.status] || 'bg-slate-500/20 text-slate-500';
        const label = record.status === 'half-day' ? 'Half-day' :
            record.status.charAt(0).toUpperCase() + record.status.slice(1);

        return (
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium w-fit ${colorClass}`}>
                {label}
            </div>
        );
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 w-24 bg-white/5 rounded-xl opacity-50"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = attendanceHistory?.find(r => r.date.startsWith(dateStr));

            days.push(
                <div key={day} className="h-32 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors relative group">
                    <span className="text-lg font-medium text-white">{day}</span>

                    {record && (
                        <div className="mt-1">
                            {getStatusBadge(record)}
                            {record.totalHours > 0 && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span>{record.totalHours.toFixed(2)}h</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={nextMonth}
                        disabled={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) > new Date()}
                        className={`p-2 rounded-lg transition-colors ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) > new Date()
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-white hover:bg-white/10'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-slate-400 font-medium">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-4">
                    {days}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-white/10">
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
        );
    };

    const renderListView = () => (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400">
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Check In</th>
                            <th className="p-4 font-medium">Check Out</th>
                            <th className="p-4 font-medium">Total Hours</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceHistory?.map((record) => (
                            <tr key={record._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                <td className="p-4">{new Date(record.date).toLocaleDateString("en-GB")}</td>
                                <td className="p-4">
                                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                </td>
                                <td className="p-4">
                                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                </td>
                                <td className="p-4">{record.totalHours ? record.totalHours.toFixed(2) : '-'}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === 'present' ? 'bg-green-500/20 text-green-500' :
                                            record.status === 'absent' ? 'bg-red-500/20 text-red-500' :
                                                record.status === 'late' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-orange-500/20 text-orange-500'
                                        }`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {attendanceHistory?.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="heading">Attendance History</h1>

                {/* View Toggle */}
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'calendar'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Calendar</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <ListIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">List View</span>
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? renderCalendar() : renderListView()}
        </div>
    );
};

export default AttendanceHistory;
