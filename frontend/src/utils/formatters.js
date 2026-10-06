/**
 * Format ISO date string into readable human-friendly format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Extract 1-2 uppercase letters as initials from a full name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Deterministically pick a vibrant gradient avatar background based on name string
 */
const AVATAR_GRADIENTS = [
  'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/20',
  'bg-gradient-to-tr from-pink-600 to-rose-600 text-white shadow-sm shadow-pink-500/20',
  'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20',
  'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20',
  'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/20',
  'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-500/20',
  'bg-gradient-to-tr from-teal-500 to-cyan-600 text-white shadow-sm shadow-teal-500/20',
  'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20'
];

export const getAvatarBg = (name) => {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};
