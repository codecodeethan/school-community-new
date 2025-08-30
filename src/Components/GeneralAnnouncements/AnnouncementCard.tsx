import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Paperclip, Edit, Trash2 } from 'lucide-react';
import { Notice, formatDate, getTypeColor, getTypeBg, stripHtml } from '@/Utils/GeneralAnnouncementsUtils';

interface AnnouncementCardProps {
  notice: Notice;
  index: number;
  isDarkMode: boolean;
  canEdit: boolean;
  onPostClick: (noticeId: number) => void;
  onEdit: (e: React.MouseEvent, noticeId: number) => void;
  onDelete: (e: React.MouseEvent, noticeId: number) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  notice,
  index,
  isDarkMode,
  canEdit,
  onPostClick,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={() => onPostClick(notice.id)}
      className={`rounded-2xl transition-all duration-300 cursor-pointer ${
        isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow-lg hover:shadow-xl border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } overflow-hidden`}
    >
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {notice.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {notice.author}
              </p>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formatDate(notice.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBg(notice.type)} ${getTypeColor(notice.type)}`}>
              {notice.type.toUpperCase()}
            </span>
            {/* adminStudent만 Edit/Delete 버튼 표시 */}
            {canEdit && (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => onEdit(e, notice.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => onDelete(e, notice.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4">
        <h3 
          className={`text-xl font-bold mb-3 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {notice.title}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {stripHtml(notice.content).substring(0, 200)}
          {notice.content.length > 200 && '...'}
        </p>

        {/* 첨부파일 표시 */}
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="mb-4">
            <p className={`text-xs font-medium mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Attachments ({notice.attachments.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {notice.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                      : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                  }`}
                >
                  <Paperclip className="w-3 h-3" />
                  {attachment.split('/').pop()}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs">
            <div className={`flex items-center gap-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Eye className="w-3 h-3" />
              <span>{notice.viewsCount} views</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 