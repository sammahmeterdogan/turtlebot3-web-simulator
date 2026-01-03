import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Wifi, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStatus } from '../../services/api'; // Düzeltilmiş import

const Topbar = () => {
    // API sorgusu 'getStatus' kullanacak şekilde güncellendi.
    const { data: status } = useQuery({
        queryKey: ['simulationStatus'],
        queryFn: getStatus,
        refetchInterval: 5000,
    });

    const isRunning = status?.running;

    return (
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40 h-16">
            <div>
                {/* Logo veya Proje Adı (Sidebar'da olduğu için burada minimal tuttuk) */}
                <h1 className="text-lg font-bold text-white">
                    <Link to="/dashboard">OVERSEER</Link>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Sistem Durum Göstergeleri */}
                <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2" title="ROS Durumu">
                        <GitBranch className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-medium text-gray-300">ROS2 Humble</span>
                    </div>
                    <div className="w-px h-4 bg-gray-700" />
                    <div className="flex items-center gap-2" title="Simülasyon Durumu">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        <span className={`text-xs font-medium ${isRunning ? 'text-green-400' : 'text-red-400'}`}>
                            {isRunning ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                    <div className="w-px h-4 bg-gray-700" />
                    <div className="flex items-center gap-2" title="Bağlantı">
                        <Wifi className={`w-4 h-4 ${isRunning ? 'text-green-400' : 'text-red-500'}`} />
                        <span className="text-xs font-medium text-gray-300">
                            {isRunning ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                {/* Kullanıcı ve Bildirimler */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;