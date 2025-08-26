import React from 'react'
import { motion } from 'framer-motion'
import { Ghost } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'

export default function NotFound() {
    return (
        <PageContainer
            title="Page Not Found"
            description="The page you are looking for doesn't exist."
        >
            <div className="flex items-center justify-center h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <Ghost className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">404</h2>
                    <p className="text-gray-400">Try using the sidebar to navigate.</p>
                </motion.div>
            </div>
        </PageContainer>
    )
}
