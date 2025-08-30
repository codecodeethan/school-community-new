export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  type: string;
  viewsCount: number;
  attachments: string[];
  createdAt: string;
}

export const categories = ['All', 'Important', 'Notice', 'Event', 'Update'];

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'Important': return 'text-red-500';
    case 'Event': return 'text-blue-500';
    case 'Update': return 'text-green-500';
    case 'Notice': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

export const getTypeBg = (type: string) => {
  switch (type) {
    case 'Important': return 'bg-red-100 dark:bg-red-900/20';
    case 'Event': return 'bg-blue-100 dark:bg-blue-900/20';
    case 'Update': return 'bg-green-100 dark:bg-green-900/20';
    case 'Notice': return 'bg-yellow-100 dark:bg-yellow-900/20';
    default: return 'bg-gray-100 dark:bg-gray-700';
  }
};

export const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const generatePaginationPages = (currentPage: number, totalPages: number) => {
  const pages = [];
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
  }
  
  return pages;
};
