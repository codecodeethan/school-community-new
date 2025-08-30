import React from 'react';
import { useThemeStore } from '@/Stores/themeStore';
import { ArrowRight, Calendar, User, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GalleryCardProps {
  departmentGalleryData: {
    department1: { name: string; item: any | null };
    department2: { name: string; item: any | null };
  } | null;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ departmentGalleryData }) => {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  const handleCardClick = (item: any) => {
    if (item?.googleDriveUrl) {
      window.open(item.googleDriveUrl, '_blank');
    } else {
      alert('No gallery link available');
    }
  };

  if (!departmentGalleryData) {
    return (
      <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 text-center">
          <p className={`text-gray-500 dark:text-gray-400 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Loading gallery data...
          </p>
        </div>
      </div>
    );
  }

  const { department1, department2 } = departmentGalleryData;

  return (
    <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <header className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h4 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Department Galleries
        </h4>
        <button
          onClick={() => router.push('/gallery')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border transition-colors duration-200 cursor-pointer hover:shadow-md ${
              isDarkMode
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => department1.item && handleCardClick(department1.item)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 font-semibold text-lg">
                    {department1.name.charAt(0)}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className={`text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {department1.name}
                </h5>
                
                {department1.item ? (
                  <>
                    <p className={`text-xs mb-3 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {department1.item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(department1.item.eventDate).toLocaleDateString()}</span>
                      </div>
                      
                      {department1.item.googleDriveUrl && (
                        <div className="flex items-center gap-1 text-red-500">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Gallery</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No recent gallery items
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors duration-200 cursor-pointer hover:shadow-md ${
              isDarkMode
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => department2.item && handleCardClick(department2.item)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {department2.name.charAt(0)}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className={`text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {department2.name}
                </h5>
                
                {department2.item ? (
                  <>
                    <p className={`text-xs mb-3 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {department2.item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(department2.item.eventDate).toLocaleDateString()}</span>
                      </div>
                      
                      {department2.item.googleDriveUrl && (
                        <div className="flex items-center gap-1 text-blue-500">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Gallery</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No recent gallery items
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
