'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavbarContainer from './NavbarContainer'
import Logo from './Logo'
import UserDropdown from './UserDropdown'
import { useAuthStore } from '@/Stores/authStore'

const Navbar = () => {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action)
    
    switch (action) {
      case 'login':
        router.push('/login')
        setIsUserDropdownOpen(false)
        setIsLanguageDropdownOpen(false)
        setIsThemeDropdownOpen(false)
        return
      case 'logout':
        // 로그아웃은 UserDropdown에서 직접 처리
        setIsUserDropdownOpen(false)
        setIsLanguageDropdownOpen(false)
        setIsThemeDropdownOpen(false)
        return
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
