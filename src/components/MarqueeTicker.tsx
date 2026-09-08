import React from 'react';
import { Flame } from 'lucide-react';
import { MarqueeUpdate } from '../types';

interface MarqueeTickerProps {
  items: MarqueeUpdate[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ items }) => {
  const activeItems = items.filter((item) => item.active);
  const marqueeText = activeItems.map((item) => item.text).join('   ||   ');

  return (
    <div className="bg-[#ffcc00] text-black font-bold text-xs sm:text-sm py-1 px-2.5 border-b border-amber-500 shadow-xs flex items-center gap-1.5 overflow-hidden">
      <span className="bg-red-700 text-white text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1 shrink-0">
        <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
        LATEST UPDATES
      </span>
      <div className="overflow-hidden whitespace-nowrap w-full">
        <marquee behavior="scroll" direction="left" scrollamount="6" className="font-bold tracking-wide text-xs sm:text-sm">
          {marqueeText || '🔥 Welcome to Sarkari Portal - Daily Jobs, Admit Cards, and Examination Results Updates!'}
        </marquee>
      </div>
    </div>
  );
};
