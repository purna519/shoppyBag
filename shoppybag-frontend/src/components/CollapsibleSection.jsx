import React, { useState } from 'react'

/**
 * CollapsibleSection Component
 * Reusable collapsible section with header and content
 */
export default function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="collapsible-section">
      <div 
        className="collapsible-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} collapsible-icon`}></i>
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  )
}
