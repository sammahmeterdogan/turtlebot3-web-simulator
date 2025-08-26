import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizeClasses[size]} relative`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent" />
            </motion.div>
        </div>
    )
}

export default LoadingSpinner