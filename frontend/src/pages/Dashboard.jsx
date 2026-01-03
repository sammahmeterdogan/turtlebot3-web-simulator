import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bot, Cpu, Map, Play, HardDrive, Wifi, Activity } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { getStatus, getMaps, getExamples } from '../services/api';
import { rosClient } from '../services/rosClient';

const StatCard = ({ icon: Icon, title, value, color, isLoading }) => (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
        <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            {isLoading ? (
                <div className="h-7 w-24 bg-gray-700 rounded-md animate-pulse mt-1" />
            ) : (
                <p className="text-xl font-bold text-white">{value}</p>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [rosConnected, setRosConnected] = useState(rosClient.isConnected());

    useEffect(() => {
        const interval = setInterval(() => setRosConnected(rosClient.isConnected()), 1000);
        return () => clearInterval(interval);
    }, []);

    const { data: status, isLoading: isStatusLoading } = useQuery({
        queryKey: ['simulationStatus'],
        queryFn: getStatus,
        refetchInterval: 5000,
    });

    const { data: maps, isLoading: areMapsLoading } = useQuery({ queryKey: ['maps'], queryFn: getMaps });
    const { data: examples, isLoading: areExamplesLoading } = useQuery({ queryKey: ['examples'], queryFn: getExamples });

    const quickActions = [
        { title: 'Start Simulator', icon: Play, action: () => navigate('/simulator'), color: 'green' },
        { title: 'View Examples', icon: Cpu, action: () => navigate('/examples'), color: 'purple' },
        { title: 'Manage Maps', icon: Map, action: () => navigate('/maps'), color: 'orange' },
    ];

    return (
        <PageContainer title="System Dashboard" description="An overview of the simulation environment.">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Activity}
                        title="Simulation Status"
                        value={status?.running ? 'Running' : 'Stopped'}
                        color={status?.running ? 'green' : 'gray'}
                        isLoading={isStatusLoading}
                    />
                    <StatCard
                        icon={Bot}
                        title="Robot Model"
                        value={status?.model || 'N/A'}
                        color="blue"
                        isLoading={isStatusLoading}
                    />
                    <StatCard
                        icon={Wifi}
                        title="ROS Bridge"
                        value={rosConnected ? 'Connected' : 'Disconnected'}
                        color={rosConnected ? 'green' : 'red'}
                    />
                    <StatCard
                        icon={HardDrive}
                        title="Saved Maps"
                        value={maps?.length || 0}
                        color="orange"
                        isLoading={areMapsLoading}
                    />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={action.title}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={action.action}
                                className={`bg-gray-900 border border-gray-800 rounded-xl p-6 text-left hover:border-${action.color}-500/50 transition-all group`}
                            >
                                <div className={`inline-flex p-3 bg-${action.color}-500/10 rounded-lg mb-4 group-hover:bg-${action.color}-500/20 transition-colors`}>
                                    <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                                </div>
                                <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Dashboard;