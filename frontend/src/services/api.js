import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Backend'den gelen yanıtları standartlaştırmak için
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        return Promise.reject(new Error(message));
    }
);

// --- Simulation ---
export const getStatus = () => apiClient.get('/sim/status');
export const startSimulation = (request) => apiClient.post('/sim/start', request);
export const stopSimulation = () => apiClient.post('/sim/stop');

// --- Maps ---
export const getMaps = () => apiClient.get('/map/list');
export const saveMap = (name) => apiClient.post('/map/save', { name });

// --- Examples ---
export const getExamples = () => apiClient.get('/examples');

// --- Teleop ---
export const teleopAPI = {
    sendTwist: (data) => {
        // Convert geometry_msgs/Twist format to backend TwistDTO format
        const twist = {
            linear: data.linear?.x || data.linear || 0,
            angular: data.angular?.z || data.angular || 0,
            topic: '/cmd_vel'
        }
        return apiClient.post('/teleop/twist', twist)
    }
}

// --- Simulation ---
export const simulationAPI = {
    status: () => apiClient.get('/sim/status'),
    start: (data) => apiClient.post('/sim/start', data),
    stop: () => apiClient.post('/sim/stop')
}

// --- Visualization ---
export const visualizationAPI = {
    getRvizUrl: () => apiClient.get('/visualization/rviz')
}