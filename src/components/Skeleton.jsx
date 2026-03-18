import './Skeleton.css';

export default function Skeleton({ type = 'text', width, height, circle }) {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: circle ? '50%' : '8px'
  };

  return (
    <div 
      className={`skeleton skeleton--${type} ${circle ? 'skeleton--circle' : ''}`} 
      style={style}
    />
  );
}
