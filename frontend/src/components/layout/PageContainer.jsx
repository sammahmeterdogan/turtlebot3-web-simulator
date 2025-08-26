import React from 'react'
import { motion } from 'framer-motion'

const PageContainer = ({ children, title, description, actions }) => {
  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
      >
        {/* Page Header */}
        {(title || description || actions) && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                  )}
                  {description && (
                      <p className="text-gray-400">{description}</p>
                  )}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">{actions}</div>
                )}
              </div>
            </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </motion.div>
  )
}

export default PageContainer