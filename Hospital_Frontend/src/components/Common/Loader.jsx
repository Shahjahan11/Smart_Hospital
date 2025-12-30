const Loader = ({ size = 'md', color = 'hospital-blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    'hospital-blue': 'border-hospital-blue',
    'white': 'border-white',
    'gray': 'border-gray-400'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;