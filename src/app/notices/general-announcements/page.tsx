"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { useAnnouncement } from "@/Hooks/useAnnouncement";
import { Toaster } from 'sonner';
import {
  AnnouncementCard,
  FilterSection,
  Pagination,
  PageHeader,
  LoadingState,
  EmptyState
} from "@/Components/GeneralAnnouncements";
import { Notice } from "@/Utils/GeneralAnnouncementsUtils";

export default function GeneralAnnouncementsPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { getAllNotices, deleteNotice, isLoading } = useAnnouncement();
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');
  
  const canWritePost = !!(isLoggedIn && user && user.role === 'adminStudent');

  const loadNotices = useCallback(async () => {
    const response = await getAllNotices({
      limit: itemsPerPage,
      page: currentPage,
      sortBy,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      search: searchTerm || undefined
    });
    
    if ('notices' in response) {
      setNotices(response.notices);
      setPagination(response.pagination);
    }
  }, [getAllNotices, itemsPerPage, currentPage, sortBy, selectedCategory, searchTerm]);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, itemsPerPage, searchTerm]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const handleCreatePost = () => {
    router.push('/notices/general-announcements/create');
  };

  const handlePostClick = (noticeId: number) => {
    router.push(`/notices/general-announcements/${noticeId}`)
  }

  const handleEdit = (e: React.MouseEvent, noticeId: number) => {
    e.stopPropagation();
    router.push(`/notices/general-announcements/edit?id=${noticeId}`);
  };

  const handleDelete = async (e: React.MouseEvent, noticeId: number) => {
    e.stopPropagation();
    
    const isConfirmed = window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.');
    
    if (isConfirmed) {
      const success = await deleteNotice(noticeId);
      if (success) {
        // 삭제 성공 시 목록 새로고침
        loadNotices();
      }
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Navbar />
        <Sidebar />

        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <PageHeader
            isDarkMode={isDarkMode}
            canWritePost={canWritePost}
            onCreatePost={handleCreatePost}
          />

          <FilterSection
            isDarkMode={isDarkMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />

          {/* 로딩 상태 */}
          {isLoading && <LoadingState isDarkMode={isDarkMode} />}

          {/* 게시글 피드 */}
          {!isLoading && (
            <div className="space-y-4">
              <AnimatePresence>
                {notices.map((notice, index) => (
                  <AnnouncementCard
                    key={notice.id}
                    notice={notice}
                    index={index}
                    isDarkMode={isDarkMode}
                    canEdit={!!(user?.role === 'adminStudent')}
                    onPostClick={handlePostClick}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* 결과 없음 */}
          {!isLoading && notices.length === 0 && <EmptyState isDarkMode={isDarkMode} />}

          {/* 페이지네이션 */}
          <Pagination
            isDarkMode={isDarkMode}
            pagination={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
} 