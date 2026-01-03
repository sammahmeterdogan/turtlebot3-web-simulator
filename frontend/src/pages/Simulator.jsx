import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Play, StopCircle } from 'lucide-react';

import PageContainer from '../components/layout/PageContainer';
import ModelSelector from '../components/simulation/ModelSelector';
import ScenarioSelector from '../components/simulation/ScenarioSelector';
import StatusPanel from '../components/simulation/StatusPanel';
import RvizPanel from '../components/simulation/RvizPanel';
import TurtlesimPanel from '../components/simulation/TurtlesimPanel';
import TeleopPad from '../components/simulation/TeleopPad';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import { getStatus, startSimulation, stopSimulation } from '../services/api';
import { rosClient } from '../services/rosClient';

const Simulator = () => {
    const queryClient = useQueryClient();
    const [selectedModel, setSelectedModel] = useState('BURGER');
    const [selectedScenario, setSelectedScenario] = useState('TELEOP');
    const [telemetry, setTelemetry] = useState({});

    const { data: status, isLoading: isStatusLoading } = useQuery({
        queryKey: ['simulationStatus'],
        queryFn: getStatus,
        refetchInterval: 5000,
        onSuccess: (data) => {
            if (data.running && !rosClient.isConnected()) {
                rosClient.connect(data.wsUrl)
                    .then(() => console.log('ROSBridge connected.'))
                    .catch(e => console.error("ROSBridge connection failed:", e));
            } else if (!data.running && rosClient.isConnected()) {
                rosClient.disconnect();
            }
        }
    });

    const startMutation = useMutation({
        mutationFn: () => startSimulation({ model: selectedModel, scenario: selectedScenario }),
        onSuccess: () => {
            toast.success('Simulation starting...');
            queryClient.invalidateQueries({ queryKey: ['simulationStatus'] });
        },
        onError: (error) => toast.error(`Failed to start: ${error.message}`),
    });

    const stopMutation = useMutation({
        mutationFn: stopSimulation,
        onSuccess: () => {
            toast.success('Simulation stopping...');
            queryClient.invalidateQueries({ queryKey: ['simulationStatus'] });
        },
        onError: (error) => toast.error(`Failed to stop: ${error.message}`),
    });

    const handleTeleop = (twist) => {
        if (!isRunning) return;
        const topic = selectedScenario === 'TURTLESIM' ? '/turtle1/cmd_vel' : '/cmd_vel';
        rosClient.publishTopic(topic, 'geometry_msgs/Twist', {
            linear: { x: twist.linear, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: twist.angular },
        });
    };

    const isRunning = status?.running;
    const isTurtlesim = selectedScenario === 'TURTLESIM';
    const isMutationPending = startMutation.isPending || stopMutation.isPending;

    return (
        <PageContainer
            title={isTurtlesim ? "Turtlesim" : "TurtleBot3 Simulator"}
            description="Real-time robotics simulation and control interface."
            actions={
                isRunning ? (
                    <button onClick={() => stopMutation.mutate()} disabled={isMutationPending} className="btn btn-danger">
                        <StopCircle size={20} />
                        <span>{stopMutation.isPending ? 'Stopping...' : 'Stop Simulation'}</span>
                    </button>
                ) : (
                    <button onClick={() => startMutation.mutate()} disabled={isMutationPending} className="btn btn-success">
                        <Play size={20} />
                        <span>{startMutation.isPending ? 'Starting...' : 'Start Simulation'}</span>
                    </button>
                )
            }
        >
            {(isStatusLoading && !status) ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                    {/* Sol Panel */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        {!isTurtlesim && <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} disabled={isRunning} />}
                        <ScenarioSelector selectedScenario={selectedScenario} onScenarioChange={setSelectedScenario} disabled={isRunning} />
                        <div className="card p-4 flex-grow"><TeleopPad enabled={isRunning} onMove={handleTeleop} /></div>
                    </div>

                    {/* Orta Panel */}
                    <div className="xl:col-span-2 card h-full relative overflow-hidden">
                        {isTurtlesim ? <TurtlesimPanel /> : <RvizPanel />}
                    </div>

                    {/* Sağ Panel */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <StatusPanel status={status} telemetry={telemetry} />
                        {!isTurtlesim && <div className="card p-4 h-48"><h3 className="text-lg font-semibold text-gray-200">Camera Feed</h3></div>}
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default Simulator;