'use client'

import React, { useState } from 'react'
import NavbarContainer from './NavbarContainer'
import Logo from './Logo'
import UserDropdown from './UserDropdown'


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action)
    
    switch (action) {
      case 'language':
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
        setIsThemeDropdownOpen(false)
        return
      case 'theme':
        setIsThemeDropdownOpen(!isThemeDropdownOpen)
        setIsLanguageDropdownOpen(false)
        return
      default:
        setIsUserDropdownOpen(false)
        setIsLanguageDropdownOpen(false)
        setIsThemeDropdownOpen(false)
    }
  }

  const handleSubmenuSelection = () => {
    // 서브메뉴에서 선택 시 드롭다운 닫고 서브메뉴 초기화
    setIsUserDropdownOpen(false)
    setIsLanguageDropdownOpen(false)
    setIsThemeDropdownOpen(false)
  }

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  return (
    <NavbarContainer>
      <Logo />
      <UserDropdown
        isLoggedIn={isLoggedIn}
        isUserDropdownOpen={isUserDropdownOpen}
        isLanguageDropdownOpen={isLanguageDropdownOpen}
        isThemeDropdownOpen={isThemeDropdownOpen}
        onUserDropdownToggle={handleUserDropdownToggle}
        onMenuAction={handleMenuAction}
        onSubmenuSelection={handleSubmenuSelection}
      />
    </NavbarContainer>
  )
}

export default Navbar
