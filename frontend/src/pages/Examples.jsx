import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Code, Tags, Play, Cpu, Keyboard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getExamples, launchExample } from '../services/api'; // Düzeltilmiş import

const Examples = () => {
    const navigate = useNavigate();
    const { data: examples, isLoading, error } = useQuery({
        queryKey: ['examples'],
        queryFn: getExamples,
    });

    const launchMutation = useMutation({
        mutationFn: (exampleId) => launchExample(exampleId),
        onSuccess: () => {
            toast.success('Example launched! Redirecting to simulator...');
            navigate('/simulator');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to launch example.');
        }
    });

    if (error) return <div>Error loading examples: {error.message}</div>;

    return (
        <PageContainer title="Code Examples" description="Explore and run various pre-built scenarios.">
            {/* Keyboard Teleop Demo Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-blue-700 rounded-xl overflow-hidden hover:border-blue-600 transition-all cursor-pointer"
                onClick={() => navigate('/demo/keyboard-control')}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Keyboard className="w-8 h-8 text-blue-400" />
                        </div>
                        <span className="px-3 py-1 text-xs rounded-full border border-green-800 bg-green-900/50 text-green-400">
                            DEMO
                        </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Keyboard Teleoperation Demo</h3>
                    <p className="text-gray-300 text-sm mb-4">
                        Turtlesim-style keyboard control demo. Control the robot using W/A/S/D keys and see it move in real-time.
                    </p>
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                        <span>Try Demo</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examples.map((example, index) => (
                        <motion.div
                            key={example.key || index} // 'key' prop eklendi
                            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <Cpu className="w-6 h-6 text-blue-400" />
                                    <h3 className="text-xl font-bold text-gray-100">{example.title}</h3>
                                </div>
                                <p className="text-gray-400 mb-4 text-sm">{example.description || 'No description available.'}</p>
                                <div className="flex items-center gap-2">
                                    <Tags size={16} className="text-gray-500" />
                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{example.category || 'GENERAL'}</span>
                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{example.difficulty || 'MEDIUM'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 p-4 mt-auto">
                                <button
                                    onClick={() => launchMutation.mutate(example.key)}
                                    disabled={launchMutation.isPending}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-600"
                                >
                                    <Play size={18} />
                                    {launchMutation.isPending && launchMutation.variables === example.key ? 'Launching...' : 'Run in Simulator'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default Examples;