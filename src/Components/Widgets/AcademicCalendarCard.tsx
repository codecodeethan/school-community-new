import React from 'react';
import { useThemeStore } from '@/Stores/themeStore';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'exam' | 'holiday' | 'event' | 'deadline';
}

const events: Event[] = [
  {
    id: 1,
    title: "Midterm Exams",
    date: "2024-12-15",
    time: "9:00 AM",
    location: "All Classrooms",
    type: "exam"
  },
  {
    id: 2,
    title: "Winter Break",
    date: "2024-12-20",
    time: "All Day",
    location: "School Closed",
    type: "holiday"
  },
  {
    id: 3,
    title: "Science Fair",
    date: "2024-12-18",
    time: "2:00 PM",
    location: "Gymnasium",
    type: "event"
  },
  {
    id: 4,
    title: "Project Deadline",
    date: "2024-12-22",
    time: "11:59 PM",
    location: "Online",
    type: "deadline"
  }
];

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'exam': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'holiday': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'event': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'deadline': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const AcademicCalendarCard: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className={`rounded-2xl shadow-lg border transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <header className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h4 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Academic Calendar
        </h4>
        <Calendar className={`w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </header>

      <div className="px-6 pb-6">
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className={`text-sm font-medium line-clamp-1 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {event.title}
                </h5>
                <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getEventTypeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                {event.time !== 'All Day' && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};