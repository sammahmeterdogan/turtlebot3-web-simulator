import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    Map as MapIcon,
    Download,
    Upload,
    Trash2,
    Eye,
    Edit2,
    Save as SaveIcon,
    X,
    Plus,
    Search,
    Grid,
    List,
    Calendar,
    HardDrive,
    MapPin,
    Loader
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import { mapAPI } from '../services/api'

const Maps = () => {
    const queryClient = useQueryClient()

    // ==== Hızlı kaydet (senin eski kartın) ====
    const [name, setName] = useState('map_' + Math.floor(Date.now() / 1000))
    const [items, setItems] = useState([])

    const refreshSimpleList = useCallback(() => {
        // interceptor response.data döndürdüğü için r zaten data
        mapAPI.list().then((r) => setItems(r || []))
    }, [])

    useEffect(() => { refreshSimpleList() }, [refreshSimpleList])

    const saveQuick = async () => {
        try {
            await mapAPI.save({ name })
            toast.success('Map saved successfully')
            refreshSimpleList()
            queryClient.invalidateQueries({ queryKey: ['maps'] })
        } catch (e) {
            toast.error('Failed to save map')
            console.error(e)
        }
    }

    // ==== Yeni grid/list arayüz ====
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMap, setSelectedMap] = useState(null)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [editingMap, setEditingMap] = useState(null)

    const { data: maps, isLoading } = useQuery({
        queryKey: ['maps'],
        queryFn: mapAPI.list,
    })

    const deleteMap = useMutation({
        mutationFn: (id) => mapAPI.delete(id),
        onSuccess: () => {
            toast.success('Map deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['maps'] })
            refreshSimpleList()
        },
        onError: () => {
            toast.error('Failed to delete map')
        }
    })

    const loadMap = useMutation({
        mutationFn: (id) => mapAPI.load(id),
        onSuccess: () => {
            toast.success('Map loaded successfully')
        },
        onError: () => {
            toast.error('Failed to load map')
        }
    })

    const filteredMaps = maps?.filter((m) =>
        m.name?.toLowerCase?.().includes(searchQuery.toLowerCase())
    )

    const formatFileSize = (bytes) => {
        if (!bytes && bytes !== 0) return '-'
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const MapCard = ({ map, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
        >
            {/* Map Preview */}
            <div className="aspect-video bg-gray-800 relative group">
                {map.pgmFilePath ? (
                    <img
                        src={`http://localhost:8080/api/map/preview/${map.id}`}
                        alt={map.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/placeholder-map.png' }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <MapIcon className="w-12 h-12 text-gray-600" />
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedMap(map)}
                        className="p-2 bg-white/20 backdrop-blur rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => loadMap.mutate(map.id)}
                        className="p-2 bg-primary-600/80 backdrop-blur rounded-lg text-white hover:bg-primary-600 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Map Info */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold">{map.name}</h3>
                    <button
                        onClick={() => deleteMap.mutate(map.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{map.width}x{map.height}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{formatFileSize((map.sizeMb || 0) * 1024 * 1024)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{map.createdAt ? new Date(map.createdAt).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Grid className="w-3 h-3" />
                        <span>Res: {map.resolution ?? '-'}m</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                    </button>
                    <button
                        onClick={() => setEditingMap(map)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                    >
                        <Edit2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    )

    const MapListItem = ({ map, index }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all"
        >
            <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {map.pgmFilePath ? (
                        <img
                            src={`http://localhost:8080/api/map/preview/${map.id}`}
                            alt={map.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <MapIcon className="w-8 h-8 text-gray-600" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{map.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{map.width}x{map.height} px</span>
                        <span>{formatFileSize((map.sizeMb || 0) * 1024 * 1024)}</span>
                        <span>Resolution: {map.resolution ?? '-'}m</span>
                        <span>{map.createdAt ? new Date(map.createdAt).toLocaleDateString() : '-'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => loadMap.mutate(map.id)}
                        className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => deleteMap.mutate(map.id)}
                        className="p-2 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )

    return (
        <PageContainer
            title="Saved Maps"
            description="Manage your SLAM-generated and imported maps"
            actions={
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Map
                    </button>
                </div>
            }
        >
            {/* Hızlı Kaydet Kartı (eski yapın korunarak) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">Save Map</h3>
                    <div className="flex gap-2">
                        <input
                            className="input flex-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="map_1234567890"
                        />
                        <button onClick={saveQuick} className="btn-success">
                            Save
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        * Harita dosyaları backend tarafında <code>ros-stack/maps</code> altına yazılır.
                    </div>
                </div>

                {/* Basit liste (senin eski “Saved Maps” bölümün) */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">Saved Maps (Simple)</h3>
                    <div className="grid gap-3">
                        {items.length === 0 && <div className="text-gray-500 text-sm">No maps yet…</div>}
                        {items.map((m) => (
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3" key={m.id}>
                                <strong className="text-white">{m.name}</strong>
                                <div className="text-xs text-gray-500 mt-1">{m.yamlFilePath || m.filePath}</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 text-xs border border-gray-700">
                    size: {m.sizeMb?.toFixed?.(3) ?? '-'} MB
                  </span>
                                    <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 text-xs border border-gray-700">
                    res: {m.resolution ?? '-'}
                  </span>
                                    <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 text-xs border border-gray-700">
                    w×h: {(m.width || '-')}×{(m.height || '-')}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search maps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{filteredMaps?.length || 0} maps</span>
                            <span className="text-gray-700">|</span>
                            <span>
                {formatFileSize(
                    (maps?.reduce((acc, m) => acc + (m.sizeMb || 0), 0) || 0) * 1024 * 1024
                )} total
              </span>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Maps Display */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader className="w-8 h-8 text-primary-400 animate-spin" />
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMaps?.map((map, index) => (
                        <MapCard key={map.id} map={map} index={index} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMaps?.map((map, index) => (
                        <MapListItem key={map.id} map={map} index={index} />
                    ))}
                </div>
            )}

            {filteredMaps?.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                    <MapIcon className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-2">No maps found</p>
                    <p className="text-gray-500 text-sm">Create maps using SLAM or upload existing ones</p>
                </div>
            )}

            {/* Basit önizleme modalı (seçili harita) */}
            <AnimatePresence>
                {selectedMap && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedMap(null)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-4 max-w-3xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-semibold">{selectedMap.name}</h3>
                                <button onClick={() => setSelectedMap(null)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                                {selectedMap.pgmFilePath ? (
                                    <img
                                        src={`http://localhost:8080/api/map/preview/${selectedMap.id}`}
                                        alt={selectedMap.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <MapIcon className="w-12 h-12 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload modalını ileride doldurursun – state korunuyor */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setIsUploadModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold">Upload Map</h3>
                                <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-gray-400 text-sm">
                                (Implementasyon bekleniyor) Buraya PGM+YAML yükleme formu eklenecek.
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageContainer>
    )
}

export default Maps
