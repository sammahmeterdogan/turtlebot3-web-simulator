import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Layout from './components/layout/Layout'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Simulator = lazy(() => import('./pages/Simulator'))
const Examples = lazy(() => import('./pages/Examples'))
const Maps = lazy(() => import('./pages/Maps'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <LoadingSpinner size="large" />
        </motion.div>
    </div>
)

function App() {
    return (
        <Router>
            <AnimatePresence mode="wait">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="simulator" element={<Simulator />} />
                            <Route path="examples" element={<Examples />} />
                            <Route path="maps" element={<Maps />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Suspense>
            </AnimatePresence>
        </Router>
    )
}

export default App