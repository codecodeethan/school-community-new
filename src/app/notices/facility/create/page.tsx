"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { useDepartmentGallery } from "@/Hooks/useDepartmentGallery";
import { CreateGalleryForm } from "@/Components/DepartmentGallery";

export default function CreateFacilityGalleryPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { createGalleryItem } = useDepartmentGallery();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              You don't have permission to create gallery items.
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
      const result = await createGalleryItem(formData);
      
      if (result) {
        router.push('/notices/facility');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/notices/facility');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />
      
      <CreateGalleryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        department="facility"
      />
      
      <Footer />
    </div>
  );
} 