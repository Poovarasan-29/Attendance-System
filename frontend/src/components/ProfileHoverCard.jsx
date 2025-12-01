import { useState } from 'react';
import { User, Mail } from 'lucide-react';

const ProfileHoverCard = ({ user }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Profile Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer">
                {user?.name?.charAt(0)}
            </div>
            <span className="text-sm font-medium hidden md:block">{user?.name}</span>

            {/* Hover Card */}
            {isHovered && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">{user?.name}</h3>
                            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-slate-400">Employee ID</p>
                                <p className="text-sm text-white font-medium">{user?.employeeId || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-slate-400">Email</p>
                                <p className="text-sm text-white font-medium break-all">{user?.email || 'N/A'}</p>
                            </div>
                        </div>

                        {user?.department && (
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs text-slate-400 mb-1">Department</p>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {user.department}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHoverCard;
