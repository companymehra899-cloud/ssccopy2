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
    <div className="bg-[#ffcc00] text-black font-extrabold text-sm sm:text-base py-2.5 px-3 border-b-2 border-amber-500 shadow-sm flex items-center gap-2 overflow-hidden">
      <span className="bg-red-700 text-white text-xs sm:text-sm font-black uppercase px-2.5 py-1 rounded shadow flex items-center gap-1 shrink-0">
        <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
        LATEST UPDATES
      </span>
      <div className="overflow-hidden whitespace-nowrap w-full">
        <marquee behavior="scroll" direction="left" scrollamount="6" className="font-extrabold tracking-wide text-sm sm:text-base">
          {marqueeText || '🔥 Welcome to Sarkari Portal - Daily Jobs, Admit Cards, and Examination Results Updates!'}
        </marquee>
      </div>
    </div>
  );
};
