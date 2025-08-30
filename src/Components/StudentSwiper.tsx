"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Student } from '@/Constants/ScData';
import StudentCard from './Sc/StudentCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface StudentSwiperProps {
  students: Student[];
  title: string;
}

const StudentSwiper: React.FC<StudentSwiperProps> = ({ students, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {title && (
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          {title}
        </h3>
      )}
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="student-swiper"
      >
        {students.map((student, index) => (
          <SwiperSlide key={student.name}>
            <StudentCard student={student} index={index} />
          </SwiperSlide>
        ))}
        
        <div className="swiper-button-prev !text-red-500 !bg-white dark:!bg-gray-700 !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg"></div>
        <div className="swiper-button-next !text-red-500 !bg-white dark:!bg-gray-700 !w-12 !h-12 !rounded-full !shadow-lg after:!text-lg"></div>
      </Swiper>
      
      <style jsx global>{`
        .student-swiper .swiper-pagination-bullet {
          background: #ef4444;
          opacity: 0.5;
        }
        .student-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #ef4444;
        }
        .student-swiper .swiper-button-prev:hover,
        .student-swiper .swiper-button-next:hover {
          background: #fef2f2 !important;
        }
        .dark .student-swiper .swiper-button-prev:hover,
        .dark .student-swiper .swiper-button-next:hover {
          background: #374151 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default StudentSwiper; 