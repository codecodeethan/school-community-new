"use client";

import React, { useEffect, useRef } from "react";
import {
  LOGGED_IN_MENU_ITEMS,
  NON_LOGGED_IN_MENU_ITEMS,
  LANGUAGES,
  MenuItem,
  LanguageOption,
} from "@/Constants/menuItems";
import {
  User,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  ChevronUp,
} from "lucide-react";
import { useThemeStore } from "../../Stores/themeStore";
import { useLanguageStore } from "../../Stores/languageStore";

interface UserDropdownProps {
  isLoggedIn: boolean;
  isUserDropdownOpen: boolean;
  isLanguageDropdownOpen: boolean;
  isThemeDropdownOpen: boolean;
  onUserDropdownToggle: () => void;
  onMenuAction: (action: string) => void;
  onSubmenuSelection: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isLoggedIn,
  isUserDropdownOpen,
  isLanguageDropdownOpen,
  isThemeDropdownOpen,
  onUserDropdownToggle,
  onMenuAction,
  onSubmenuSelection,
}) => {
  const { isDarkMode, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    onSubmenuSelection();
  };

  const handleThemeChange = (theme: string) => {
    if (theme === "light") {
      setTheme(false);
    } else if (theme === "dark") {
      setTheme(true);
    }
    onSubmenuSelection();
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      User,
      Settings,
      LogOut,
      LogIn,
      UserPlus,
      Globe,
      Sun,
      Moon,
    };
    return iconMap[iconName] || User;
  };

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isUserDropdownOpen) {
          onSubmenuSelection(); // 드롭다운과 서브메뉴 모두 닫기
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen, onSubmenuSelection]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onUserDropdownToggle}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
          isDarkMode ? "hover:bg-gray-500" : "hover:bg-gray-200"
        }`}
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <span
          className={`text-sm font-bold transition-colors duration-300 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {isLoggedIn ? "USER" : "GUEST"}
        </span>
        {isUserDropdownOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
        )}
      </button>

      {/* User Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50 transform origin-top-right transition-all duration-300 ease-out ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        } ${
          isUserDropdownOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {(isLoggedIn ? LOGGED_IN_MENU_ITEMS : NON_LOGGED_IN_MENU_ITEMS).map(
          (item: MenuItem) => {
            const IconComponent = getIconComponent(item.icon || "User");
            return (
              <div key={item.id} className="relative">
                {item.divider ? (
                  <hr
                    className={`my-1 transition-colors duration-300 ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  />
                ) : (
                  <button
                    onClick={() => onMenuAction(item.action)}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors duration-200 flex items-center justify-between ${
                      isDarkMode
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {(item.action === "language" ||
                      item.action === "theme") && (
                      <ChevronDown className="w-3 h-3 transition-transform duration-200" />
                    )}
                  </button>
                )}

                {/* Language Submenu */}
                <div
                  className={`absolute right-full top-0 mr-1 w-48 rounded-lg shadow-lg border py-1 z-50 transform origin-top-right transition-all duration-300 ease-out ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  } ${
                    item.action === "language" && isLanguageDropdownOpen
                      ? "scale-100 opacity-100 translate-x-0"
                      : "scale-95 opacity-0 translate-x-2 pointer-events-none"
                  }`}
                >
                  {LANGUAGES.map((lang: LanguageOption) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors duration-200 flex items-center space-x-2 ${
                        isDarkMode
                          ? "text-gray-100 hover:bg-gray-700"
                          : "text-gray-900 hover:bg-gray-100"
                      } ${
                        language === lang.code
                          ? isDarkMode
                            ? "bg-gray-600"
                            : "bg-gray-200"
                          : ""
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>

                {/* Theme Submenu */}
                <div
                  className={`absolute right-full top-0 mr-1 w-32 rounded-lg shadow-lg border py-1 z-50 transform origin-top-right transition-all duration-300 ease-out ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  } ${
                    item.action === "theme" && isThemeDropdownOpen
                      ? "scale-100 opacity-100 translate-x-0"
                      : "scale-95 opacity-0 translate-x-2 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors duration-200 flex items-center space-x-2 ${
                      isDarkMode
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-900 hover:bg-gray-100"
                    } ${
                      !isDarkMode
                        ? isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-200"
                        : ""
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>LIGHT</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors duration-200 flex items-center space-x-2 ${
                      isDarkMode
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-900 hover:bg-gray-100"
                    } ${
                      isDarkMode
                        ? isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-200"
                        : ""
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>DARK</span>
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
