'use client'

import React, { useState } from 'react'
import SidebarContainer from './SidebarContainer'
import ToggleButton from './ToggleButton'
import SidebarHeader from './SidebarHeader'
import NavigationItems from './NavigationItems'
import SidebarFooter from './SidebarFooter'
import Overlay from './Overlay'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClose={closeSidebar} />
      
      <SidebarContainer isOpen={isOpen}>
        <ToggleButton isOpen={isOpen} onToggle={toggleSidebar} />
        
        <div className="flex flex-col h-full">
          <SidebarHeader isOpen={isOpen} />
          <NavigationItems isOpen={isOpen} />
          <SidebarFooter isOpen={isOpen} />
        </div>
      </SidebarContainer>
    </>
  )
}

export default Sidebar 