import React, { useState, useEffect } from 'react';
import { Play, User, Calendar, Clock, Pencil, X } from 'lucide-react';
import { useThemeStore } from '@/Stores/themeStore';
import { useRouter } from 'next/navigation';
import { useHero, HeroData } from '@/Hooks/useHero';

interface HeroProps {
  isAdmin: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isAdmin }) => {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  
  const { 
    heroData, 
    heroExists,
    isLoading, 
    error, 
    createHero,
    createHeroWithVideo,
    updateHero, 
    updateHeroWithVideo 
  } = useHero();
  
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<HeroData>({
    title: "Welcome to Our School Community",
    context: "Discover the latest updates, events, and stories from our vibrant school community. Stay connected with what's happening on campus.",
    videoUrl: "https://www.youtube.com/watch?v=l1woNquXTGs&pp=ugUEEgJrbw%3D%3D",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSourceType, setVideoSourceType] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (heroData) {
      setEditForm(heroData);
      if (heroData.videoUrl && heroData.videoUrl.includes('cloudinary.com')) {
        setVideoSourceType('file');
        setVideoFile(null);
      } else if (heroData.videoUrl) {
        setVideoSourceType('url');
        setVideoFile(null);
      } else {
        setVideoSourceType('url');
        setVideoFile(null);
      }
    } else {
      setEditForm({
        title: "Welcome to Our School Community",
        context: "Discover the latest updates, events, and stories from our vibrant school community. Stay connected with what's happening on campus.",
        videoUrl: "https://www.youtube.com/watch?v=l1woNquXTGs&pp=ugUEEgJrbw%3D%3D",
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
      setVideoSourceType('url');
      setVideoFile(null);
    }
  }, [heroData]);

  const parseVideoUrl = (url: string) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname;
      
      if (host.includes("youtube.com") || host.includes("youtu.be")) {
        let videoId = "";
        if (host.includes("youtu.be")) {
          videoId = u.pathname.replace("/", "");
        } else {
          videoId = u.searchParams.get("v") || "";
          if (!videoId && u.pathname.startsWith("/embed/"))
            videoId = u.pathname.split("/").pop() || "";
        }
        if (videoId) {
          return {
            type: "iframe",
            src: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&controls=1`,
          };
        }
      }
      
      if (host.includes("drive.google")) {
        const fileId = u.pathname.split('/')[3];
        if (fileId) {
          return {
            type: "iframe",
            src: `https://drive.google.com/file/d/${fileId}/preview`,
          };
        }
      }
      
      if (url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
        return {
          type: "video",
          src: url,
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !heroData) {
    return (
      <div className="w-full h-96 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">Error loading hero content</div>
      </div>
    );
  }

  const currentData = heroData || {
    title: "Welcome to Our School Community",
    context: "Discover the latest updates, events, and stories from our vibrant school community. Stay connected with what's happening on campus.",
    videoUrl: "https://www.youtube.com/watch?v=l1woNquXTGs&pp=ugUEEgJrbw%3D%3D",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const videoInfo = parseVideoUrl(currentData.videoUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (videoSourceType === 'file' && videoFile) {
        if (heroExists) {
          await updateHeroWithVideo(editForm, videoFile, isAdmin);
        } else {
          await createHeroWithVideo(editForm, videoFile, isAdmin);
        }
      } else if (videoSourceType === 'url' && editForm.videoUrl && editForm.videoUrl.trim()) {
        if (heroExists) {
          await updateHero(editForm, isAdmin);
        } else {
          await createHero(editForm, isAdmin);
        }
      } else {
        if (heroExists) {
          await updateHero(editForm, isAdmin);
        } else {
          await createHero(editForm, isAdmin);
        }
      }
      
      setIsEditOpen(false);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoSourceType('file');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, videoUrl: e.target.value }));
    setVideoSourceType('url');
  };

  const handleVideoSourceChange = (type: 'url' | 'file') => {
    setVideoSourceType(type);
  };

  return (
    <section className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <div className="relative w-full h-full">
        {videoInfo?.type === 'iframe' ? (
          <iframe
            src={videoInfo.src}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoInfo?.type === 'video' ? (
          <video
            src={videoInfo.src}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            <Play className="w-20 h-20 text-white opacity-50" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {currentData.title}
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl opacity-90">
            {currentData.context}
          </p>
          
          <div className="flex items-center gap-6 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>School Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{currentData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Latest Update</span>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <button
          onClick={() => setIsEditOpen(true)}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {heroExists ? 'Edit Hero' : 'Create Hero'}
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Context
                </label>
                <textarea
                  value={editForm.context}
                  onChange={(e) => setEditForm(prev => ({ ...prev, context: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Source
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="url"
                      checked={videoSourceType === 'url'}
                      onChange={() => handleVideoSourceChange('url')}
                      className="mr-2"
                    />
                    URL
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="file"
                      checked={videoSourceType === 'file'}
                      onChange={() => handleVideoSourceChange('file')}
                      className="mr-2"
                    />
                    File Upload
                  </label>
                </div>
              </div>

              {videoSourceType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={editForm.videoUrl}
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {videoSourceType === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="video/*"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {heroExists ? 'Update Hero' : 'Create Hero'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
