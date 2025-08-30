"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { useDepartmentGallery, GalleryItem } from "@/Hooks/useDepartmentGallery";
import { 
  GalleryHeader, 
  GalleryFilters, 
  MonthlyGallery 
} from "@/Components/DepartmentGallery";
import { 
  convertGalleryItemToEventPhoto, 
  EventPhoto,
  swiperStyles 
} from "@/Utils/DepartmentGalleryUtils";

export default function PublicRelationsPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { getAllGalleryItems, deleteGalleryItem, isLoading } = useDepartmentGallery();
  
  const [selectedYear, setSelectedYear] = useState(2025);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // API에서 데이터 가져오기 함수
  const loadGalleryItems = useCallback(async (year: number) => {
    try {
      const response = await getAllGalleryItems({
        department: 'public-relations',
        year: year,
        limit: 100,
        sortBy: 'eventDate'
      });
      
      if ('galleryItems' in response) {
        setGalleryItems(response.galleryItems);
      } else {
        setGalleryItems([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery items');
      setGalleryItems([]);
    }
  }, [getAllGalleryItems]);

  // 초기 데이터 로드
  useEffect(() => {
    loadGalleryItems(selectedYear);
  }, [loadGalleryItems]);

  // 년도 변경 핸들러
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    loadGalleryItems(year);
  }, [loadGalleryItems]);

  // GalleryItem을 EventPhoto로 변환
  const events = galleryItems.map(convertGalleryItemToEventPhoto);

  const handleDropdownToggle = (eventId: number) => {
    setOpenDropdown(openDropdown === eventId ? null : eventId);
  };

  const handleEdit = (eventId: number) => {
    setOpenDropdown(null);
    router.push(`/notices/public-relations/edit?id=${eventId}`);
  };

  const handleDelete = async (eventId: number) => {
    setOpenDropdown(null);
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const success = await deleteGalleryItem(eventId);
        if (success) {
          await loadGalleryItems(selectedYear);
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  const handleAddClick = () => {
    router.push('/notices/public-relations/create');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Navbar />
        <Sidebar />
        <main className="max-w-7xl mx-auto flex-1 w-full px-4 py-8">
          <div className={`text-center py-12 rounded-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Loading gallery items...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{swiperStyles}</style>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <Navbar />
        <Sidebar />

        <main className="max-w-7xl mx-auto flex-1 w-full px-4 py-8">
          <GalleryHeader 
            onAddClick={handleAddClick} 
            title="Public Relations Gallery"
            description="Explore our events and activities"
          />
          
          <GalleryFilters
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />

          {error && (
            <div className={`text-center py-4 mb-6 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
            }`}>
              {error}
            </div>
          )}

          <MonthlyGallery
            events={events}
            selectedYear={selectedYear}
            openDropdown={openDropdown}
            onDropdownToggle={handleDropdownToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        <Footer />
      </div>
    </>
  );
} 