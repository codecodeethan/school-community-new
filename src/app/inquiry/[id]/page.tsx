"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pin,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useInquiry } from "@/Hooks/useInquiry";
import { useAuthStore } from "@/Stores/authStore";
import { useThemeStore } from "@/Stores/themeStore";
import { Navbar } from "@/Components/Navbar";
import { Sidebar } from "@/Components/Sidebar";
import { Footer } from "@/Components/Footer";

interface Inquiry {
  id: number;
  title: string;
  description: string;
  isAnonymous: boolean;
  userId?: number;
  status: "Pending" | "In Progress" | "Completed" | "Rejected" | "Pinned";
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  netLikes: number;
  authorName?: string;
  userLikeStatus?: 'like' | 'dislike' | null;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { getInquiry, toggleLike } = useInquiry();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  const inquiryId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (inquiryId) {
      loadInquiryDetail();
    }
  }, [inquiryId]);

  const loadInquiryDetail = async () => {
    if (!inquiryId) return;

    setIsLoadingDetail(true);
    try {
      const userId = user?.id;
      const data = await getInquiry(inquiryId, userId);
      setInquiry(data || null);
    } catch (error) {
      toast.error("Failed to load inquiry");
      console.error("Error loading inquiry:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    router.push("/inquiry");
  };

  const handleToggleLike = async (isLike: boolean) => {
    if (!inquiry) return;
    
    try {
      const result = await toggleLike(inquiry.id, isLike);
      if (result) {
        // 성공 시 inquiry 데이터 새로고침
        await loadInquiryDetail();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

 
  // 상태별 색상 및 아이콘 매핑
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          icon: Clock,
          label: "Pending",
        };
      case "In Progress":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: AlertCircle,
          label: "In Progress",
        };
      case "Completed":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          label: "Completed",
        };
      case "Rejected":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label: "Rejected",
        };
      case "Pinned":
        return {
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          icon: Pin,
          label: "Pinned",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  if (isLoadingDetail) {
    return (
      <>
        <Toaster position="bottom-right" richColors closeButton />
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <Navbar />
          <Sidebar />
          <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
            {/* Back Button Skeleton */}
            <div className="animate-pulse mb-8">
              <div
                className={`h-10 rounded-lg w-48 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="animate-pulse">
              <div
                className={`rounded-2xl shadow-xl border overflow-hidden ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                {/* Header Skeleton */}
                <div
                  className={`p-8 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-6 h-6 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`w-20 h-6 rounded-full ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                  <div
                    className={`h-12 rounded mb-6 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`w-24 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`w-32 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`w-20 h-4 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-8">
                  <div className="space-y-4">
                    <div
                      className={`h-4 rounded w-full ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-3/4 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-5/6 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-2/3 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-full ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-4/5 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!inquiry) {
    return (
      <>
        <Toaster position="bottom-right" richColors closeButton />
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <Navbar />
          <Sidebar />
          <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1
                className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  isDarkMode ? "text-red-400" : "text-red-500"
                }`}
              >
                Inquiry Not Found
              </h1>
              <p
                className={`text-lg transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                The inquiry you're looking for doesn't exist.
              </p>
              <button
                onClick={handleBack}
                className="mt-6 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
              >
                Go Back
              </button>
            </motion.div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const statusInfo = getStatusInfo(inquiry.status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Navbar />
        <Sidebar />

        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={20} />
              Back to Inquiries
            </motion.button>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              {/* Header Section */}
              <div
                className={`p-8 border-b transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100 border-gray-700"
                    : "bg-white text-gray-900 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <StatusIcon size={24} className={statusInfo.color} />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-300 ${
                      isDarkMode
                        ? `${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`
                        : `${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`
                    }`}
                  >
                    {statusInfo.label}
                  </span>
                  {inquiry.status === "Pinned" && (
                    <Pin className="w-5 h-5 text-purple-500" />
                  )}
                </div>

                <h1
                  className={`text-4xl font-bold mb-6 leading-tight transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {inquiry.title}
                </h1>

                <div
                  className={`flex items-center gap-6 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {inquiry.isAnonymous ? (
                      <EyeOff size={18} className="text-red-500" />
                    ) : (
                      <User size={18} className="text-red-500" />
                    )}
                    <span className="font-medium">
                      {inquiry.isAnonymous
                        ? "Anonymous"
                        : inquiry.authorName || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-red-500" />
                    <span>{formatDate(inquiry.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-red-500" />
                    <span>{inquiry.viewCount} views</span>
                  </div>
                </div>
              </div>

                             {/* Content Section */}
               <div
                 className={`p-8 transition-colors duration-300 ${
                   isDarkMode ? "bg-gray-800" : "bg-white"
                 }`}
               >
                 <div className="space-y-6">
                   {/* Content */}
                   <div>
                     <div
                       className={`prose prose-lg max-w-none prose-red transition-colors duration-300 ${
                         isDarkMode ? "prose-invert" : ""
                       }`}
                     >
                       <p
                         className={`text-lg leading-relaxed transition-colors duration-300 ${
                           isDarkMode ? "text-gray-300" : "text-gray-700"
                         }`}
                       >
                         {inquiry.description}
                       </p>
                     </div>
                   </div>

                                       {/* Like/Dislike Section */}
                    <div className="flex items-center justify-center gap-6 pt-4">
                      <button
                        onClick={() => handleToggleLike(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <ThumbsUp className={`w-5 h-5 transition-colors duration-300 ${
                          inquiry.userLikeStatus === 'like' ? 'text-red-500' : ''
                        }`} />
                        <span className="font-medium">{inquiry.likeCount}</span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleLike(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <ThumbsDown className={`w-5 h-5 transition-colors duration-300 ${
                          inquiry.userLikeStatus === 'dislike' ? 'text-red-500' : ''
                        }`} />
                        <span className="font-medium">{inquiry.dislikeCount}</span>
                      </button>
                    </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
