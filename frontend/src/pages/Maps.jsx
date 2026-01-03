import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Map as MapIcon, Download, Trash2, Loader, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import { getMaps, deleteMap, loadMap, saveMap } from '../services/api'; // Düzeltilmiş import

const Maps = () => {
    const queryClient = useQueryClient();
    const [mapName, setMapName] = useState(`map_${Math.floor(Date.now() / 1000)}`);

    const { data: maps, isLoading: areMapsLoading } = useQuery({
        queryKey: ['maps'],
        queryFn: getMaps,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMap(id),
        onSuccess: () => {
            toast.success('Map deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['maps'] });
        },
        onError: () => toast.error('Failed to delete map'),
    });

    const loadMutation = useMutation({
        mutationFn: (id) => loadMap(id),
        onSuccess: () => toast.success('Map loaded into simulation'),
        onError: () => toast.error('Failed to load map'),
    });

    const saveMutation = useMutation({
        mutationFn: () => saveMap(mapName),
        onSuccess: () => {
            toast.success(`Map '${mapName}' saved.`);
            queryClient.invalidateQueries({ queryKey: ['maps'] });
            setMapName(`map_${Math.floor(Date.now() / 1000)}`);
        },
        onError: () => toast.error('Failed to save map.'),
    });


    return (
        <PageContainer title="Manage Maps" description="Browse, download, or delete saved maps.">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Save Current Map</h3>
                <div className="flex gap-2">
                    <input
                        className="input flex-1"
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                        placeholder="map_1234567890"
                    />
                    <button onClick={() => saveMutation.mutate()} className="btn-success" disabled={saveMutation.isPending}>
                        {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {areMapsLoading && <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {maps?.map((map, index) => (
                    <motion.div
                        key={map.id} // key prop eklendi
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col"
                    >
                        <div className="bg-gray-800 h-40 flex items-center justify-center">
                            <MapIcon size={48} className="text-gray-600"/>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="text-lg font-bold text-gray-100">{map.name}</h3>
                            <div className="text-sm text-gray-400 mt-1">
                                Created: {new Date(map.createdAt).toLocaleDateString()}
                            </div>
                            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-700">
                                <button onClick={() => loadMutation.mutate(map.id)} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm" disabled={loadMutation.isPending}>
                                    <Upload size={16} /> Load
                                </button>
                                <button className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors" onClick={() => deleteMutation.mutate(map.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageContainer>
    );
};

export default Maps;