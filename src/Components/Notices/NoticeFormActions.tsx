import React from 'react'
import { Save, X } from 'lucide-react'

interface NoticeFormActionsProps {
  isLoading: boolean
  title: string
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
  isEdit?: boolean
}

export default function NoticeFormActions({ 
  isLoading, 
  title, 
  onCancel, 
  onSubmit,
  isEdit = false
}: NoticeFormActionsProps) {
  return (
    <div className="flex gap-4 justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          (isLoading || !title.trim()) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onSubmit}
      >
        <Save className="w-4 h-4" />
        {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Announcement' : 'Create Announcement')}
      </button>
    </div>
  )
} 