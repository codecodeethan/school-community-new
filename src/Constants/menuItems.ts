export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: string;
  divider?: boolean;
}

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' }
];

export const LOGGED_IN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    label: 'PROFILE',
    icon: 'User',
    action: 'profile'
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: 'Settings',
    action: 'settings'
  },
  {
    id: 'divider1',
    label: '',
    action: '',
    divider: true
  },
  {
    id: 'language',
    label: 'LANGUAGE',
    icon: 'Globe',
    action: 'language'
  },
  {
    id: 'theme',
    label: 'THEME',
    icon: 'Sun',
    action: 'theme'
  },
  {
    id: 'divider2',
    label: '',
    action: '',
    divider: true
  },
  {
    id: 'logout',
    label: 'LOGOUT',
    icon: 'LogOut',
    action: 'logout'
  }
];

export const NON_LOGGED_IN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'login',
    label: 'LOGIN',
    icon: 'LogIn',
    action: 'login'
  },
  {
    id: 'divider1',
    label: '',
    action: '',
    divider: true
  },
  {
    id: 'language',
    label: 'LANGUAGE',
    icon: 'Globe',
    action: 'language'
  },
  {
    id: 'theme',
    label: 'THEME',
    icon: 'Sun',
    action: 'theme'
  }
]; 