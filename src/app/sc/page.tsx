"use client"

import React, { useState, Suspense, lazy } from "react";
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { departments, getLeadership } from "@/Constants/ScData";
import { useThemeStore } from "@/Stores/themeStore";

// Lazy load components
const StudentCard = lazy(() => import("@/Components/Sc/StudentCard"));
const StudentSwiper = lazy(() => import("@/Components/Sc/StudentSwiper"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

export default function ScPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("public_relations");
  const { isDarkMode } = useThemeStore();

  const departmentButtons = [
    { id: "public_relations", name: "Public Relations" },
    { id: "hall_functions", name: "Hall Functions" },
    { id: "spirit", name: "Spirit" },
    { id: "facility", name: "Facility" }
  ];

  const currentDepartment = departments.find(d => d.id === selectedDepartment);
  const leadership = getLeadership(selectedDepartment);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />

      {/* 배너 이미지 */}
      <div className="relative w-full h-full md:h-80">
        <Image
          src="/sc-banner.jpg"
          alt="Student Council Banner"
          fill
          style={{ objectFit: "cover" }} 
          priority
          sizes="100vw"
        />
        {isDarkMode && (
          <div className="absolute inset-0 bg-black/50" />
        )}
      </div>

      <main className="max-w-7xl mx-auto flex-1 w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Meet Our Team
          </h2>
          <p className={`text-xl transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover the dedicated students who make our school community thrive
          </p>
        </motion.div>

        {/* 부서별 버튼 섹션 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-4">
              {departmentButtons.map((department, index) => (
                <motion.button
                  key={department.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDepartment(department.id)}
                  className={`
                    px-6 py-4 rounded-lg font-bold transition-all duration-300 text-center w-full
                    ${selectedDepartment === department.id 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white border border-gray-700'
                        : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white border border-gray-200'
                    }
                    border-2 border-transparent hover:border-red-500 active:border-red-500
                  `}
                >
                  {department.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 선택된 부서 정보 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDepartment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h3 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {currentDepartment?.name}
              </h3>
            </div>

            {/* 리더십 섹션 */}
            {leadership.length > 0 && (
              <div className="mb-12">
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentSwiper 
                    students={leadership} 
                    title="Leadership Team" 
                  />
                </Suspense>
              </div>
            )}

            {/* 멤버 그리드 */}
            <div className="mb-8">
              <h4 className={`text-2xl font-semibold mb-6 text-center transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Team Members
              </h4>
              
              {/* 모바일용 Swiper (768px 이하) */}
              <div className="md:hidden mb-8">
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentSwiper 
                    students={currentDepartment?.members || []} 
                    title="" 
                  />
                </Suspense>
              </div>

              {/* 데스크톱용 그리드 (768px 이상) */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Suspense fallback={
                  <div className="col-span-full">
                    <LoadingSpinner />
                  </div>
                }>
                  {currentDepartment?.members.map((student, index) => (
                    <StudentCard 
                      key={student.name} 
                      student={student} 
                      index={index} 
                    />
                  ))}
                </Suspense>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}