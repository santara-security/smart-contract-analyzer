'use client';
const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  // Use named animation class for compatibility
  const animationClass = disabled ? 'shiny-text disabled' : 'shiny-text';

  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${animationClass} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;