'use client'

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/Stores/themeStore';
import { useAnnouncement } from '@/Hooks/useAnnouncement';
import { Notice } from '@/Utils/GeneralAnnouncementsUtils';
import { formatDate } from '@/Utils/GeneralAnnouncementsUtils';
import { getTypeColor, getTypeBg } from '@/Utils/GeneralAnnouncementsUtils';
import { ArrowRight, Eye, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RecentAnnouncement: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { getLatestNotice } = useAnnouncement();
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadLatestNotice = async () => {
      try {
        const notice = await getLatestNotice();
        setLatestNotice(notice);
      } catch (error) {
        setLatestNotice(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestNotice();
  }, [getLatestNotice]);

  if (isLoading) {
    return (
      <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!latestNotice) {
    return (
      <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 text-center">
          <p className={`text-gray-500 dark:text-gray-400 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No recent announcements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <header className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h4 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Recent Announcement
        </h4>
        <button
          onClick={() => router.push('/notices/general-announcements')}
          className={`inline-flex items-center gap-2 text-sm font-medium ${
            isDarkMode
              ? 'text-red-400 hover:text-red-300'
              : 'text-red-600 hover:text-red-500'
          }`}
        >
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <div className="px-6 pb-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            {latestNotice.imageUrl && (
              <img
                src={latestNotice.imageUrl}
                alt={latestNotice.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBg(latestNotice.type)} ${getTypeColor(latestNotice.type)}`}>
                  {latestNotice.type}
                </span>
              </div>
              <h5 className={`text-base font-semibold mb-2 line-clamp-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {latestNotice.title}
              </h5>
              <p className={`text-sm mb-3 line-clamp-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {latestNotice.content.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{latestNotice.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(latestNotice.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{latestNotice.viewsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
