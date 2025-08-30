import { GalleryItem } from '@/Hooks/useDepartmentGallery';

export interface EventPhoto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  month: number;
  year: number;
  googleDriveUrl?: string;
}

export const months = [
  { number: 12, name: 'December' },
  { number: 11, name: 'November' },
  { number: 10, name: 'October' },
  { number: 9, name: 'September' },
  { number: 8, name: 'August' },
  { number: 7, name: 'July' },
  { number: 6, name: 'June' },
  { number: 5, name: 'May' },
  { number: 4, name: 'April' },
  { number: 3, name: 'March' },
  { number: 2, name: 'February' },
  { number: 1, name: 'January' },
];

export const convertGalleryItemToEventPhoto = (item: GalleryItem): EventPhoto => ({
  id: item.id,
  title: item.title,
  description: item.description,
  imageUrl: item.thumbnailUrl || '/no_thumbnail.jpg',
  date: item.eventDate,
  month: item.month,
  year: item.year,
  googleDriveUrl: item.googleDriveUrl
});

export const swiperStyles = `
  .swiper-dark .swiper-button-next,
  .swiper-dark .swiper-button-prev {
    color: #ef4444;
  }
  .swiper-dark .swiper-pagination-bullet {
    background: #f3f4f6;
  }
  .swiper-dark .swiper-pagination-bullet-active {
    background: #ef4444;
  }
  .swiper-light .swiper-button-next,
  .swiper-light .swiper-button-prev {
    color: #ef4444;
  }
  .swiper-light .swiper-pagination-bullet {
    background: #374151;
  }
  .swiper-light .swiper-pagination-bullet-active {
    background: #ef4444;
  }
`;

export const canCreateGallery = (userRole?: string) => userRole === 'adminStudent';
export const canEditGallery = (userRole?: string) => userRole === 'adminStudent';

export const generateYearOptions = (startYear: number = 2020, endYear: number = 2030) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
};
