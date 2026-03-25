const Rivet = ({ className = '' }) => {
  return (
    <div 
      className={`absolute w-[9px] h-[9px] bg-rivet rounded-full border-[1.5px] border-rivet-border shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)] ${className}`} 
    />
  );
};

export default Rivet;