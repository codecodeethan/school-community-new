import React from 'react'

interface NoticeFormFieldsProps {
  title: string
  setTitle: (title: string) => void
  type: string
  setType: (type: string) => void
  isDarkMode: boolean
}

const noticeTypes = [
  { value: 'Important', label: 'Important' },
  { value: 'Notice', label: 'Notice' },
  { value: 'Event', label: 'Event' },
  { value: 'Update', label: 'Update' },
]

export default function NoticeFormFields({ 
  title, 
  setTitle, 
  type, 
  setType, 
  isDarkMode 
}: NoticeFormFieldsProps) {
  return (
    <>
      {/* 제목 입력 */}
      <div className="mb-6">
        <label htmlFor="title" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title..."
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
          required
        />
      </div>

      {/* 타입 선택 */}
      <div className="mb-6">
        <label htmlFor="type" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-gray-50 border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
        >
          {noticeTypes.map((noticeType) => (
            <option key={noticeType.value} value={noticeType.value}>
              {noticeType.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
} 