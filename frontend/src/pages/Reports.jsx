import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import axios from 'axios';

const Reports = () => {
    const { user } = useSelector((state) => state.auth);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);


    useEffect(() => {
        // Set default date range to current month
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const end = today.toISOString().split('T')[0];
        setStartDate(start);
        setEndDate(end);

        axios.get(import.meta.env.VITE_API_BASE_URL + '/data/departments')
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        // Initial fetch
        fetchReports(start, end);
    }, []);

    const fetchReports = async (start, end, empId = '', dept = '') => {
        try {
            setLoading(true);
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    startDate: start,
                    endDate: end,
                    employeeId: empId,
                    department: dept
                }
            };

            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/attendance/all', config);

            let filteredData = response.data;

            // Client-side filtering
            if (start && end) {
                filteredData = filteredData.filter(item => item.date >= start && item.date <= end);
            }

            if (empId) {
                filteredData = filteredData.filter(item =>
                    item.userId.employeeId.toLowerCase().includes(empId.toLowerCase()) ||
                    item.userId.name.toLowerCase().includes(empId.toLowerCase())
                );
            }

            if (dept) {
                filteredData = filteredData.filter(item =>
                    item.userId.department.toLowerCase() === dept.toLowerCase()
                );
            }

            setAttendanceData(filteredData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchReports(startDate, endDate, employeeId, department);
    };

    const handleExport = async () => {
        try {
            const token = user.token;
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/attendance/export', {
                headers: { Authorization: `Bearer ${token}` },
                params: { startDate, endDate, employeeId, department },
                responseType: 'blob',
            });

            // Create blob with proper MIME type
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `attendance_report_${startDate}_to_${endDate}.csv`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Attendance Reports</h1>
                    <p className="text-slate-400 mt-1">Generate and export attendance records</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Department</label>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="" className="text-slate-500">Select Department</option>
                                {departments.map((department, index) => (
                                    <option key={index} className='text-black' value={department}>{department}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Employee ID/Name</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Search employee..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Date</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Employee</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Department</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Check In</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Check Out</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Status</th>
                                <th className="py-4 px-6 text-sm font-medium text-slate-300">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceData.length > 0 ? (
                                attendanceData.map((record) => (
                                    <tr key={record._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm font-medium text-white">{record.userId.name}</p>
                                                <p className="text-xs text-slate-400">{record.userId.employeeId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {record.userId.department}
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
                                            {record.totalHours || 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-500">
                                        No records found for the selected criteria
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

export default Reports;
