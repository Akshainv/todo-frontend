import './LoadingSpinner.css';

const LoadingSpinner = ({ size = '20px', color = 'currentColor', className = '' }) => {
  return (
    <div 
      className={`loading-spinner ${className}`} 
      style={{ width: size, height: size, borderColor: color }}
    ></div>
  );
};

export default LoadingSpinner;
