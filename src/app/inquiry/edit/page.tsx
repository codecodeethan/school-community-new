"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Send, User, EyeOff, Shield } from 'lucide-react';
import { useInquiry } from '@/Hooks/useInquiry';

interface EditInquiryFormData {
  title: string;
  description: string;
  isAnonymous: boolean;
  status?: string;
}

export default function EditInquiryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = parseInt(searchParams.get('id') || '0');
  
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { getInquiry, updateInquiry, isLoading } = useInquiry();
  
  const [formData, setFormData] = useState<EditInquiryFormData>({
    title: '',
    description: '',
    isAnonymous: false,
    status: 'Pending'
  });
  const [originalInquiry, setOriginalInquiry] = useState<any>(null);
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(true);

  // 권한 확인
  const isAdmin = user?.role === 'admin' || user?.role === 'adminStudent';
  const canEditStatus = isAdmin;
  const canEdit = isLoggedIn && user && (originalInquiry?.userId === user.id || isAdmin);

  useEffect(() => {
    const loadInquiry = async () => {
      if (!isLoggedIn || !user) {
        router.push('/login');
        return;
      }

      if (!inquiryId || inquiryId === 0) {
        toast.error('Invalid inquiry ID');
        router.push('/inquiry');
        return;
      }

      try {
        setIsLoadingInquiry(true);
        const inquiry = await getInquiry(inquiryId, user.id);
        
        if (inquiry) {
          setOriginalInquiry(inquiry);
          setFormData({
            title: inquiry.title,
            description: inquiry.description,
            isAnonymous: inquiry.isAnonymous,
            status: inquiry.status
          });
        } else {
          toast.error('Inquiry not found');
          router.push('/inquiry');
        }
      } catch (error) {
        console.error('Error loading inquiry:', error);
        toast.error('Failed to load inquiry');
        router.push('/inquiry');
      } finally {
        setIsLoadingInquiry(false);
      }
    };

    if (inquiryId && inquiryId !== 0) {
      loadInquiry();
    }
  }, [inquiryId, isLoggedIn, user, router, getInquiry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!canEdit) {
      toast.error('You do not have permission to edit this inquiry');
      return;
    }

    try {
      const updateData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        isAnonymous: formData.isAnonymous
      };

      // 상태 수정은 admin만 가능
      if (canEditStatus && formData.status) {
        updateData.status = formData.status;
      }

      const result = await updateInquiry(inquiryId, updateData);

      if (result) {
        router.push('/inquiry');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const handleCancel = () => {
    router.push('/inquiry');
  };

  if (!isLoggedIn || !user) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Navbar />
        <Sidebar />
        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <div className={`text-center py-12 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Please log in to edit an inquiry.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoadingInquiry) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Navbar />
        <Sidebar />
        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <div className={`text-center py-12 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Loading inquiry...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Navbar />
        <Sidebar />
        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <div className={`text-center py-12 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              You do not have permission to edit this inquiry.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />
      
      <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-xl p-8 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleCancel}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Edit Inquiry
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Update your inquiry details
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your inquiry title..."
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your inquiry in detail..."
                rows={8}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                required
              />
            </div>

            {/* Status (Admin only) */}
            {canEditStatus && (
              <div>
                <label htmlFor="status" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Status (Admin Only)
                  </div>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pinned">Pinned</option>
                </select>
              </div>
            )}

            {/* Anonymous Option */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className={`w-4 h-4 rounded transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-red-500' 
                    : 'bg-gray-50 border-gray-300 text-red-500'
                } focus:ring-red-500`}
              />
              <label htmlFor="isAnonymous" className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <EyeOff className="w-4 h-4" />
                Post anonymously
              </label>
            </div>

            {/* Author Info */}
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <User className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {formData.isAnonymous ? 'Anonymous' : user.name}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formData.isAnonymous ? 'Your identity will be hidden' : 'Your name will be visible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Updating...' : 'Update Inquiry'}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}