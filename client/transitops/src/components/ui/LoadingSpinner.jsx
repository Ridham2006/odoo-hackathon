export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-8 h-8 border-4',
  };
  
  return (
    <svg className={`${sizes[size]} border-[var(--primary)] border-t-transparent rounded-full animate-spin ${className}`} viewBox="0 0 24 24" fill="none" />
  );
};

export default LoadingSpinner;