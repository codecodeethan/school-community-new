import { useState, useEffect } from 'react';
import { api } from '@/Utils/api';

export interface HeroData {
  id?: number;
  title: string;
  context: string;
  videoUrl: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HeroResponse {
  exists: boolean;
  data: HeroData;
}

export const useHero = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [heroExists, setHeroExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const defaultHeroData: HeroData = {
    title: "Welcome to Our School Community",
    context: "Discover the latest updates, events, and stories from our vibrant school community. Stay connected with what's happening on campus.",
    videoUrl: "https://www.youtube.com/watch?v=l1woNquXTGs&pp=ugUEEgJrbw%3D%3D",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  const getLatestHero = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<HeroResponse>('/hero/latest');
      
      if (response.data) {
        setHeroExists(response.data.exists);
        if (response.data.exists) {
          setHeroData(response.data.data);
        } else {
          setHeroData(defaultHeroData);
        }
      } else {
        setHeroData(defaultHeroData);
        setHeroExists(false);
      }
    } catch (error) {
      setHeroData(defaultHeroData);
      setHeroExists(false);
      setError('Failed to fetch hero data');
    } finally {
      setIsLoading(false);
    }
  };

  const createHero = async (data: Omit<HeroData, 'id' | 'createdAt' | 'updatedAt'>, isAdmin: boolean) => {
    if (!isAdmin) throw new Error('Admin privileges required');
    
    try {
      const response = await api.post('/hero/create', data, undefined, {
        'x-admin-role': 'admin'
      });
      
      if (response.message === "Hero created successfully") {
        await getLatestHero();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createHeroWithVideo = async (data: Omit<HeroData, 'id' | 'createdAt' | 'updatedAt'>, videoFile: File, isAdmin: boolean) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required');
    }
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('context', data.context);
      formData.append('videoUrl', data.videoUrl);
      formData.append('date', data.date);
      formData.append('heroVideo', videoFile);
      
      const response = await api.postFormData('/hero/create', formData, undefined, {
        'x-admin-role': 'admin'
      });
      
      if (response.message === "Hero created successfully") {
        await getLatestHero();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateHero = async (data: Omit<HeroData, 'id' | 'createdAt' | 'updatedAt'>, isAdmin: boolean) => {
    if (!isAdmin) throw new Error('Admin privileges required');
    
    try {
      const response = await api.put('/hero/update', data, undefined, {
        'x-admin-role': 'admin'
      });
      
      if (response.message === "Hero updated successfully") {
        await getLatestHero();
      } else {
        throw new Error(response.message || 'Failed to update hero');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateHeroWithVideo = async (data: Omit<HeroData, 'id' | 'createdAt' | 'updatedAt'>, videoFile: File, isAdmin: boolean) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required');
    }
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('context', data.context);
      formData.append('videoUrl', data.videoUrl || '');
      formData.append('date', data.date);
      formData.append('heroVideo', videoFile);
      
      const response = await api.putFormData('/hero/update', formData, undefined, {
        'x-admin-role': 'admin'
      });
      
      if (response.success) {
        await getLatestHero();
      } else {
        throw new Error(response.message || 'Failed to update hero with video');
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getLatestHero();
  }, []);

  return { 
    heroData, 
    heroExists,
    isLoading, 
    error, 
    getLatestHero, 
    createHero, 
    createHeroWithVideo, 
    updateHero, 
    updateHeroWithVideo, 
    setHeroData, 
    setError 
  };
};
