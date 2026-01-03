import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

// Hatalı 'simulationAPI' importu düzeltildi, 'getStatus' kullanılıyor.
import { getStatus } from '../../services/api';

const Topbar = () => {
    // API sorgusu 'getStatus' kullanacak şekilde güncellendi.
    const { data: status } = useQuery({
        queryKey: ['simulationStatus'],
        queryFn: getStatus,
        refetchInterval: 5000, // Durumu 5 saniyede bir tazele
    });

    // Backend'den gelen DTO'ya göre 'running' alanı kontrol ediliyor.
    const isRunning = status?.running;

    return (
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40">
            <div>
                <Link to="/" className="text-xl font-bold text-white">
                    TurtleBot3 <span className="text-blue-400">Simulator</span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <span className={`relative flex h-3 w-3`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                        {isRunning ? 'Simulation Running' : 'Simulation Stopped'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white">
                        <Bell size={20} />
                    </button>
                    <div className="w-px h-6 bg-gray-700"></div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {isRunning ? <Wifi size={20} className="text-green-500" /> : <WifiOff size={20} className="text-red-500" />}
                        <span>{isRunning ? 'Connected' : 'Disconnected'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;