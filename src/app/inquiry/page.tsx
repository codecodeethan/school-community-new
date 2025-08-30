"use client";

import { Navbar } from '@/Components/Navbar';
import { Sidebar } from '@/Components/Sidebar';
import { Footer } from '@/Components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/Stores/themeStore';
import { useAuthStore } from '@/Stores/authStore';
import { Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TrendingUp, ThumbsUp, ThumbsDown, MessageCircle, Eye, Clock, CheckCircle, XCircle, AlertCircle, Pin, User, Calendar, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useInquiry } from '@/Hooks/useInquiry';

// 문의글 타입 정의
interface Inquiry {
  id: number;
  title: string;
  description: string;
  isAnonymous: boolean;
  userId?: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'Pinned';
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  netLikes: number;
  authorName?: string;
  userLikeStatus?: 'like' | 'dislike' | null;
}

export default function InquiryPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user, isLoggedIn } = useAuthStore();
  const { getAllInquiries, toggleLike, deleteInquiry, isLoading } = useInquiry();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  
  const canWritePost = isLoggedIn && user;

  const handleCreatePost = () => {
    router.push('/inquiry/create');
  };

  // 권한 확인 함수
  const canEditInquiry = (inquiry: Inquiry) => {
    return isLoggedIn && user && (inquiry.userId === user.id || user.role === 'admin' || user.role === 'adminStudent');
  };

  const canDeleteInquiry = (inquiry: Inquiry) => {
    return isLoggedIn && user && (inquiry.userId === user.id || user.role === 'admin' || user.role === 'adminStudent');
  };

  // 드롭다운 토글
  const handleDropdownToggle = (inquiryId: number) => {
    setOpenDropdown(openDropdown === inquiryId ? null : inquiryId);
  };

  // 편집 핸들러
  const handleEdit = (inquiryId: number) => {
    setOpenDropdown(null);
    router.push(`/inquiry/edit?id=${inquiryId}`);
  };

  // 삭제 핸들러
  const handleDelete = async (inquiryId: number) => {
    setOpenDropdown(null);
    
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        const result = await deleteInquiry(inquiryId);
        if (result) {
          await loadInquiries(); // 목록 새로고침
        }
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  // 문의글 데이터 로드
  const loadInquiries = async () => {
    try {
      const params: any = {
        limit: itemsPerPage,
        page: currentPage
      };

      if (selectedCategory !== 'All') {
        params.status = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      // 현재 로그인한 사용자의 ID 추가
      if (user?.id) {
        params.userId = user.id;
      }

      const response = await getAllInquiries(params);

      console.log(response);
      if (response && 'inquiries' in response) {
        setInquiries(response.inquiries || []);
        setTotalInquiries(response.total || 0);
      } else {
        // API 응답이 없을 때 더미 데이터 사용
        const dummyInquiries: Inquiry[] = [
          {
            id: 1,
            title: "Library Extension Request",
            description: "We would like to request an extension of library hours during exam periods. Many students want to study late at night, but the current closing time is too early and inconvenient.",
            isAnonymous: false,
            userId: 1,
            status: 'Pending',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            viewCount: 156,
            likeCount: 24,
            dislikeCount: 2,
            netLikes: 22,
            authorName: "Kim Student"
          },
          {
            id: 2,
            title: "School Lunch Menu Improvement",
            description: "The current school lunch menu is too monotonous and lacks nutritional value. We would appreciate if you could provide healthy meals with diverse menus and fresh ingredients.",
            isAnonymous: true,
            status: 'In Progress',
            createdAt: '2024-01-14T14:20:00Z',
            updatedAt: '2024-01-16T09:15:00Z',
            viewCount: 234,
            likeCount: 45,
            dislikeCount: 5,
            netLikes: 40,
            authorName: undefined
          },
          {
            id: 3,
            title: "Gym Facility Improvement Request",
            description: "The gym floor is too slippery and shower facilities are insufficient. We request facility improvements for a safe and pleasant exercise environment.",
            isAnonymous: false,
            userId: 3,
            status: 'Completed',
            createdAt: '2024-01-10T16:45:00Z',
            updatedAt: '2024-01-18T11:30:00Z',
            viewCount: 189,
            likeCount: 67,
            dislikeCount: 3,
            netLikes: 64,
            authorName: "Park Exercise"
          },
          {
            id: 4,
            title: "Campus WiFi Speed Improvement",
            description: "The campus WiFi speed is too slow, causing problems with downloading class materials and online learning. We request network infrastructure improvements.",
            isAnonymous: false,
            userId: 4,
            status: 'Rejected',
            createdAt: '2024-01-12T11:15:00Z',
            updatedAt: '2024-01-17T14:20:00Z',
            viewCount: 312,
            likeCount: 89,
            dislikeCount: 7,
            netLikes: 82,
            authorName: "Lee Network"
          },
          {
            id: 5,
            title: "Student Council Election Notice",
            description: "The 2024 Student Council Election will begin on March 15th. We ask for active participation from all students. Detailed schedule will be announced later.",
            isAnonymous: false,
            userId: 5,
            status: 'Pinned',
            createdAt: '2024-01-20T09:00:00Z',
            updatedAt: '2024-01-20T09:00:00Z',
            viewCount: 567,
            likeCount: 123,
            dislikeCount: 1,
            netLikes: 122,
            authorName: "Student Council"
          }
        ];
        setInquiries(dummyInquiries);
        setTotalInquiries(dummyInquiries.length);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    }
  };

  // 좋아요/싫어요 토글
  const handleToggleLike = async (inquiryId: number, isLike: boolean) => {
    try {
      const result = await toggleLike(inquiryId, isLike);
      if (result) {
        // 성공 시 문의글 목록 새로고침
        await loadInquiries();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // 검색어 변경 시
  useEffect(() => {
    setCurrentPage(1);
    loadInquiries();
  }, [searchTerm, selectedCategory, itemsPerPage]);

  // 페이지 변경 시
  useEffect(() => {
    loadInquiries();
  }, [currentPage]);

  // 초기 로드
  useEffect(() => {
    loadInquiries();
  }, []);

  const categories = [
    'All',
    'Pending',
    'In Progress',
    'Completed',
    'Rejected',
    'Pinned'
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Popular' }
  ];

  const itemsPerPageOptions = [5, 10, 20, 50];

  // 상태별 색상 및 아이콘 매핑
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Pending':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, label: 'Pending' };
      case 'In Progress':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: AlertCircle, label: 'In Progress' };
      case 'Completed':
        return { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, label: 'Completed' };
      case 'Rejected':
        return { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle, label: 'Rejected' };
      case 'Pinned':
        return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Pin, label: 'Pinned' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Clock, label: 'Pending' };
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

        <main className="max-w-7xl mx-auto flex-1 w-full px-4 py-8">
                     {/* Page Header */}
           <div className="mb-8">
             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
               <div>
                 <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                   isDarkMode ? 'text-gray-100' : 'text-gray-900'
                 }`}>
                   Inquiry Board
                 </h1>
                 <p className={`text-lg transition-colors duration-300 ${
                   isDarkMode ? 'text-gray-400' : 'text-gray-600'
                 }`}>
                   Share your thoughts, ask questions, and engage with the community
                 </p>
               </div>
               {canWritePost && (
                 <motion.button
                   onClick={handleCreatePost}
                   className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full lg:w-auto ${
                     isDarkMode
                       ? 'bg-red-600 hover:bg-red-700 text-white'
                       : 'bg-red-500 hover:bg-red-600 text-white'
                   }`}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   Suggestion
                 </motion.button>
               )}
             </div>
           </div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`sticky top-4 z-10 rounded-2xl p-4 mb-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            } shadow-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* 검색 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
                <TrendingUp className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* 카테고리 필터 */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-red-500 text-white shadow-lg'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* 정렬 및 페이지 크기 필터 */}
                <div className="flex gap-3 items-center">
                  {/* 정렬 필터 */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest' | 'popular')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-700'
                    } border focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                  </select>

                  {/* 페이지 크기 필터 */}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-700'
                    } border focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Inquiry Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className={`text-center py-12 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className={`text-center py-12 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No inquiries found.
              </div>
            ) : (
              inquiries.map((inquiry, index) => {
                const statusInfo = getStatusInfo(inquiry.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                                     <motion.div
                     key={inquiry.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     className={`rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                       isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                     }`}
                     onClick={() => router.push(`/inquiry/${inquiry.id}`)}
                   >
                                     <div className="flex items-center gap-4">
                     {/* Reddit-style Vote Buttons - Centered */}
                     <div className="flex flex-col items-center gap-1 min-w-[40px] self-center">
                                               <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(inquiry.id, true);
                          }}
                          className={`p-1 rounded transition-all duration-300 hover:bg-gray-100 ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                         <ThumbsUp className={`w-5 h-5 transition-colors duration-300 ${
                           inquiry.userLikeStatus === 'like' 
                             ? 'text-red-500' 
                             : isDarkMode 
                               ? 'text-gray-400 hover:text-red-500' 
                               : 'text-gray-500 hover:text-red-500'
                         }`} />
                       </button>
                       <span className={`text-sm font-medium transition-colors duration-300 ${
                         isDarkMode ? 'text-gray-300' : 'text-gray-700'
                       }`}>
                         {inquiry.netLikes}
                       </span>
                                               <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(inquiry.id, false);
                          }}
                          className={`p-1 rounded transition-all duration-300 hover:bg-gray-100 ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                         <ThumbsDown className={`w-5 h-5 transition-colors duration-300 ${
                           inquiry.userLikeStatus === 'dislike' 
                             ? 'text-red-500' 
                             : isDarkMode 
                               ? 'text-gray-400 hover:text-blue-500' 
                               : 'text-gray-500 hover:text-blue-500'
                         }`} />
                       </button>
                     </div>

                     {/* Content */}
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-100' : 'text-gray-900'
                         }`}>
                           {inquiry.title}
                         </h3>
                         {/* Status Badge next to title */}
                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                           <StatusIcon className="w-3 h-3" />
                           {statusInfo.label}
                         </div>
                         {inquiry.status === 'Pinned' && (
                           <Pin className="w-4 h-4 text-purple-500" />
                         )}
                         
                         {/* 드롭다운 메뉴 */}
                         {(canEditInquiry(inquiry) || canDeleteInquiry(inquiry)) && (
                           <div className="relative ml-auto">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDropdownToggle(inquiry.id);
                               }}
                               className={`p-2 rounded-full transition-all duration-300 ${
                                 isDarkMode
                                   ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300'
                                   : 'bg-white/80 hover:bg-gray-100/80 text-gray-700'
                               }`}
                             >
                               <MoreHorizontal size={16} />
                             </button>
                             
                             <AnimatePresence>
                               {openDropdown === inquiry.id && (
                                 <motion.div
                                   initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                   transition={{ duration: 0.15 }}
                                   className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border ${
                                     isDarkMode
                                       ? 'bg-gray-700 border-gray-600'
                                       : 'bg-white border-gray-200'
                                   }`}
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   <div className="py-1">
                                     {canEditInquiry(inquiry) && (
                                       <button
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleEdit(inquiry.id);
                                         }}
                                         className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-300 ${
                                           isDarkMode
                                             ? 'text-gray-300 hover:bg-gray-600'
                                             : 'text-gray-700 hover:bg-gray-100'
                                         }`}
                                       >
                                         <Edit size={14} />
                                         Edit
                                       </button>
                                     )}
                                     {canDeleteInquiry(inquiry) && (
                                       <button
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleDelete(inquiry.id);
                                         }}
                                         className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-300 ${
                                           isDarkMode
                                             ? 'text-red-400 hover:bg-gray-600'
                                             : 'text-red-600 hover:bg-gray-100'
                                         }`}
                                       >
                                         <Trash2 size={14} />
                                         Delete
                                       </button>
                                     )}
                                   </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>
                         )}
                       </div>
                       
                       <p className={`text-base mb-4 transition-colors duration-300 ${
                         isDarkMode ? 'text-gray-300' : 'text-gray-600'
                       }`}>
                         {inquiry.description}
                       </p>

                       {/* Meta Information */}
                       <div className="flex items-center gap-4 text-sm">
                         <div className={`flex items-center gap-1 transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>
                           <User className="w-4 h-4" />
                           {inquiry.isAnonymous ? 'Anonymous' : (inquiry.authorName || 'Unknown')}
                         </div>
                         <div className={`flex items-center gap-1 transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>
                           <Calendar className="w-4 h-4" />
                           {new Date(inquiry.createdAt).toLocaleDateString('en-US')}
                         </div>
                         <div className={`flex items-center gap-1 transition-colors duration-300 ${
                           isDarkMode ? 'text-gray-400' : 'text-gray-500'
                         }`}>
                           <Eye className="w-4 h-4" />
                           <span className="text-sm">{inquiry.viewCount}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}