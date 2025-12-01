import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, Download, Filter } from 'lucide-react';
import axios from 'axios';

const AllEmployees = () => {
    const { user } = useSelector((state) => state.auth);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [empFilter, setEmpFilter] = useState({
        startDate: '',
        endDate: '',
        department: ''
    });

    // Separate state for applied filters (only updates when Filter button is clicked)
    const [appliedFilter, setAppliedFilter] = useState({
        startDate: '',
        endDate: '',
        department: ''
    });

    useEffect(() => {
        fetchEmployeesData();

        // Fetch departments from API 
        axios.get(import.meta.env.VITE_API_BASE_URL + '/data/departments')
            .then((res) => {
                setDepartments(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const fetchEmployeesData = async () => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/dashboard/manager', config);
            setEmployees(response.data.allEmployeesList || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees data:', error);
            setLoading(false);
        }
    };

    const handleFilter = () => {
        // Apply the current filter values when Filter button is clicked
        setAppliedFilter({
            startDate: empFilter.startDate,
            endDate: empFilter.endDate,
            department: empFilter.department
        });
    };

    const handleEmpExport = async () => {
        try {
            const token = user.token;
            const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/attendance/export', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    startDate: empFilter.startDate,
                    endDate: empFilter.endDate,
                    department: empFilter.department
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `employees_attendance_${empFilter.startDate || 'all'}_to_${empFilter.endDate || 'all'}.csv`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting employees:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    const toYMD = (input) => {
        const d = new Date(input);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const filteredEmployees = employees.filter(emp => {
        if (appliedFilter.department &&
            emp.department.toLowerCase() !== appliedFilter.department.toLowerCase()) {
            return false;
        }

        if (appliedFilter.startDate || appliedFilter.endDate) {

            const empDate = toYMD(emp.doj);
            if (appliedFilter.startDate) {
                const start = appliedFilter.startDate;
                if (empDate < start) return false;
            }

            if (appliedFilter.endDate) {
                const end = appliedFilter.endDate;
                if (empDate > end) return false;
            }
        }

        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">All Employees</h1>
                    <p className="text-slate-400 mt-1">Manage and view all employee records</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Start Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={empFilter.startDate}
                                onChange={(e) => setEmpFilter({ ...empFilter, startDate: e.target.value })}
                                className="w-full pl-4 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">End Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={empFilter.endDate}
                                onChange={(e) => setEmpFilter({ ...empFilter, endDate: e.target.value })}
                                className="w-full pl-4 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Department</label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={empFilter.department}
                                onChange={(e) => setEmpFilter({ ...empFilter, department: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept, index) => (
                                    <option key={index} className="text-black" value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleFilter}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleEmpExport}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Employee Directory ({filteredEmployees.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Employee ID</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Name</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Email</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Department</th>
                                <th className="py-4 px-4 text-sm font-medium text-slate-400">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-sm text-white font-medium">{employee.employeeId}</td>
                                        <td className="py-4 px-4 text-sm text-white">{employee.name}</td>
                                        <td className="py-4 px-4 text-sm text-slate-300">{employee.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-300">
                                            {(() => {
                                                const d = new Date(employee.doj);
                                                const day = String(d.getDate()).padStart(2, "0");
                                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                                const year = d.getFullYear();
                                                return `${day}/${month}/${year}`;
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        No employees found
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

export default AllEmployees;
