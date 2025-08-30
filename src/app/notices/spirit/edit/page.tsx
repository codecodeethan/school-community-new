"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { useDepartmentGallery } from "@/Hooks/useDepartmentGallery";
import { EditGalleryForm } from "@/Components/DepartmentGallery";

export default function EditSpiritGalleryPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { updateGalleryItem } = useDepartmentGallery();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 권한 확인
  if (user?.role !== 'adminStudent') {
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
              You don't have permission to edit gallery items.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const galleryId = urlParams.get('id');
      
      if (!galleryId) {
        router.push('/notices/spirit');
        return;
      }

      const result = await updateGalleryItem(parseInt(galleryId), formData);
      
      if (result) {
        router.push('/notices/spirit');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/notices/spirit');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />
      
      <EditGalleryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        department="spirit"
      />
      
      <Footer />
    </div>
  );
} 