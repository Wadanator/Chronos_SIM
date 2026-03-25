const LedRow = ({ label, active, type = 'amber' }) => {
  // Rozlíšenie farby LEDky podľa typu (červená pre Dym/Oheň, jantárová pre svetlá)
  const activeColor = type === 'red' ? 'bg-led-red shadow-[0_0_8px_#cc2222]' : 'bg-led-amber shadow-[0_0_8px_#e8820a]';
  const ledStyle = active ? activeColor : 'bg-led-off shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]';

  return (
    <div className={`flex items-center gap-3 py-[6px] border-b border-[#2a2218] transition-colors duration-300 ${active ? 'bg-[#2a2012]' : ''} px-2`}>
      {/* Samotná LEDka */}
      <div className={`w-3 h-3 rounded-full border border-[#111] transition-all duration-200 ${ledStyle}`} />
      
      {/* Text (Popisok) */}
      <span className={`font-mono text-sm tracking-wide ${active ? 'text-text-cream font-bold' : 'text-text-steel'}`}>
        {label}
      </span>
      
      {/* Výpis stavu vpravo */}
      <span className={`ml-auto font-mono text-xs ${active ? 'text-text-cream' : 'text-text-dim'}`}>
        {active ? 'ZAP' : 'VYP'}
      </span>
    </div>
  );
};

export default LedRow;