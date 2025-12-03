import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useGetAllEmployeesQuery, useGetAllAttendanceQuery } from '../store/apiSlice';

const TeamCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // RTK Query Hooks
    const { data: allEmployees = [], isLoading: isEmployeesLoading } = useGetAllEmployeesQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: allAttendance = [], isLoading: isAttendanceLoading } = useGetAllAttendanceQuery(undefined, { refetchOnMountOrArgChange: true });

    const isLoading = isEmployeesLoading || isAttendanceLoading;

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
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

    const daysInMonth = getDaysInMonth(currentDate);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Filter employees based on DOJ
    const viewMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    viewMonthEnd.setHours(23, 59, 59, 999);

    const employees = allEmployees.filter(emp => {
        const empDOJ = new Date(emp.createdAt); // Changed from doj to createdAt
        empDOJ.setHours(0, 0, 0, 0);
        return empDOJ <= viewMonthEnd;
    }).map(emp => ({
        id: emp._id,
        name: emp.name,
        empId: emp.employeeId,
        doj: emp.createdAt
    }));

    if (isLoading) {
        return (
            <>
                <Helmet>
                    <title>Loading Team Calendar</title>
                </Helmet>
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Team Calendar</title>
            </Helmet>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Team Calendar</h1>

                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-medium text-white min-w-[150px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
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
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-slate-900/90 backdrop-blur-sm p-4 text-left text-sm font-medium text-slate-300 border-b border-white/10 min-w-[200px]">
                                        Employee
                                    </th>
                                    {daysArray.map(day => (
                                        <th key={day} className="p-2 text-center text-xs font-medium text-slate-400 border-b border-white/10 min-w-[40px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {employees.length > 0 ? (
                                    employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                                            <td className="sticky left-0 z-10 bg-slate-900/90 backdrop-blur-sm p-4 border-r border-white/5">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{emp.name}</p>
                                                    <p className="text-xs text-slate-400">{emp.empId}</p>
                                                </div>
                                            </td>
                                            {daysArray.map(day => {
                                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const record = allAttendance.find(a => a.userId?._id === emp.id && a.date === dateStr);

                                                // Determine status
                                                let status = null;
                                                if (record) {
                                                    status = record.status;
                                                } else {
                                                    // Check if date is in the past and after DOJ
                                                    const checkDate = new Date(dateStr);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);

                                                    const empDOJ = new Date(emp.doj);
                                                    empDOJ.setHours(0, 0, 0, 0);

                                                    if (checkDate < today && checkDate >= empDOJ) {
                                                        status = 'absent';
                                                    }
                                                }

                                                return (
                                                    <td key={day} className="p-4 text-center">
                                                        {status ? (
                                                            <div
                                                                className={`w-5 h-5 mx-auto rounded-full ${getStatusColor(status)}`}
                                                                title={`${status} ${record?.totalHours ? `- ${record.totalHours}h` : ''}`}
                                                            ></div>
                                                        ) : (
                                                            <div className="w-1 h-1 mx-auto rounded-full bg-slate-800"></div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={daysInMonth + 1} className="py-8 text-center text-slate-500">
                                            No attendance data found for this month
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-300">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-sm text-slate-300">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-slate-300">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-slate-300">Half Day</span>
                    </div>
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </>
    );
};

export default TeamCalendar;
