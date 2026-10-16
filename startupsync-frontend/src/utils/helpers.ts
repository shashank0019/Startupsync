export const getTimeAgo = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    DRAFT: 'bg-yellow-100 text-yellow-800',
    PUBLISHED: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-orange-100 text-orange-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getAvailabilityColor = (status: string): string => {
  const colors: Record<string, string> = {
    AVAILABLE: 'text-green-600',
    UNAVAILABLE: 'text-red-600',
    LOOKING: 'text-blue-600',
    OPEN_TO_OPPORTUNITIES: 'text-purple-600',
  };
  return colors[status] || 'text-gray-600';
};
