"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "@/Stores/themeStore";
import { ArrowLeft, Upload, Calendar, FileText, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateGalleryFormData {
  title: string;
  description: string;
  department: string;
  eventDate: string;
  googleDriveUrl: string;
  thumbnail: File | null;
}

interface CreateGalleryFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  department: string;
}

// 부서별 라벨 매핑
const departmentLabels = {
  'public-relations': 'Public Relations',
  'facility': 'Facility',
  'hall-functions': 'Hall Functions',
  'spirit': 'Spirit'
};

export const CreateGalleryForm: React.FC<CreateGalleryFormProps> = ({
  onSubmit,
  isSubmitting,
  onCancel,
  department
}) => {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  
  const [formData, setFormData] = useState<CreateGalleryFormData>({
    title: '',
    description: '',
    department: department,
    eventDate: '',
    googleDriveUrl: '',
    thumbnail: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      thumbnail: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('eventDate', formData.eventDate);
    formDataToSend.append('googleDriveUrl', formData.googleDriveUrl);
    
    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }

    await onSubmit(formDataToSend);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onCancel}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Create Gallery Item
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`rounded-xl p-8 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-red-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500'
                }`}
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-red-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500'
                }`}
                placeholder="Enter event description"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                required
              >
                <option value={department}>
                  {departmentLabels[department as keyof typeof departmentLabels]}
                </option>
              </select>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Department is automatically set to {departmentLabels[department as keyof typeof departmentLabels]}
              </p>
            </div>

            {/* Event Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
                }`}
                required
              />
            </div>

            {/* Google Drive URL */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Google Drive URL
              </label>
              <input
                type="url"
                name="googleDriveUrl"
                value={formData.googleDriveUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-red-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500'
                }`}
                placeholder="https://drive.google.com/..."
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Thumbnail Image
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formData.thumbnail ? formData.thumbnail.name : 'Click to upload thumbnail image'}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Gallery Item'}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}; 