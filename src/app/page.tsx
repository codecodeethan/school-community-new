"use client";

import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";
import { useThemeStore } from "@/Stores/themeStore";
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { InquiryList, RecentAnnouncement } from "@/Components/Main";
import { GalleryCard } from "@/Components/Main/GalleryCard";
import { Hero } from "@/Components/Main/Hero";
import { useAuthStore } from "@/Stores/authStore";
import {
  useDepartmentGallery,
  GalleryItem,
} from "@/Hooks/useDepartmentGallery";
import { api } from "@/Utils/api";

const Page = () => {
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { accessToken } = useAuthStore();
  const { getLatestTwoDepartments } = useDepartmentGallery();
  const isAdmin = !!(
    isLoggedIn &&
    user &&
    (user.role === "admin" || user.role === "adminStudent")
  );

  const [_, setLatestDept] = useState<any | null>(null);
  const [departmentGalleryData, setDepartmentGalleryData] = useState<{
    department1: { name: string; item: GalleryItem | null };
    department2: { name: string; item: GalleryItem | null };
  } | null>(null);

  useEffect(() => {
    const loadLatestDept = async () => {
      try {
        const resp = await api.get<{ item: any }>(`/gallery/latest-any`);
        setLatestDept((resp as any).item || null);
      } catch (e) {
        console.error("Failed to fetch latest department item", e);
      }
    };
    loadLatestDept();
  }, []);

  useEffect(() => {
    const loadDepartmentGalleryData = async () => {
      try {
        const resp = await getLatestTwoDepartments();

        setDepartmentGalleryData(resp as any);
      } catch (e) {
        console.error("Failed to fetch department gallery data", e);
      }
    };
    loadDepartmentGalleryData();
  }, [getLatestTwoDepartments]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar />
      <Sidebar />

      <main className="flex-1 pt-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <section className="xl:col-span-8 space-y-8">
              <Hero isAdmin={isAdmin} />

              <GalleryCard departmentGalleryData={departmentGalleryData} />

              <section
                className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <header className="px-6 pt-6 pb-3 flex items-center justify-between">
                  <h4
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Latest from the Community
                  </h4>
                  <button
                    className={`inline-flex items-center gap-2 text-sm font-medium ${
                      isDarkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-500"
                    }`}
                  >
                    View all <ArrowRight className="w-4 h-4" />
                  </button>
                </header>

                <div className="px-6 py-12 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                    <BookOpen className="w-8 h-8 text-gray-500" />
                  </div>
                  <h5
                    className={`text-lg font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Under Development...
                  </h5>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    This section is currently being developed and will be available soon.
                  </p>
                </div>
              </section>
            </section>

            <aside className="xl:col-span-4 space-y-8">
              <RecentAnnouncement />
              <InquiryList limit={3} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
