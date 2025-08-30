'use client'

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/Stores/themeStore';
import { useInquiry } from '@/Hooks/useInquiry';
import { ArrowRight, MessageCircle, ThumbsUp, ThumbsDown, Eye, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InquiryListProps {
  limit?: number;
}

export const InquiryList: React.FC<InquiryListProps> = ({ limit = 3 }) => {
  const { isDarkMode } = useThemeStore();
  const { getTopLikedInquiries } = useInquiry();
  const [topInquiries, setTopInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTopInquiries = async () => {
      try {
        const inquiries = await getTopLikedInquiries(limit);

        console.log(inquiries)
        setTopInquiries(inquiries);
      } catch (error) {
        setTopInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopInquiries();
  }, [getTopLikedInquiries, limit]);

  if (isLoading) {
    return (
      <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (topInquiries.length === 0) {
    return (
      <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 text-center">
          <p className={`text-gray-500 dark:text-gray-400 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No inquiries yet
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
          Top Inquiries
        </h4>
        <button
          onClick={() => router.push('/inquiry')}
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
          {topInquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className={`p-4 rounded-xl border transition-colors duration-200 cursor-pointer hover:shadow-md ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => router.push(`/inquiry/${inquiry.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`text-sm font-semibold line-clamp-1 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {inquiry.title}
                    </h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inquiry.status === 'Pinned' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      inquiry.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      inquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  
                  <p className={`text-xs mb-3 line-clamp-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {inquiry.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{inquiry.isAnonymous ? 'Anonymous' : inquiry.authorName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{inquiry.likeCount}</span>
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" />
                        <span>{inquiry.dislikeCount}</span>
                      </div> */}
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{inquiry.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};