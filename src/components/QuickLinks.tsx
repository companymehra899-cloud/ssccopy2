import React from 'react';

interface QuickLinksProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  onSearchTag: (tag: string) => void;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({
  selectedState,
  onSelectState,
  onSearchTag,
}) => {
  const states = [
    { label: '🌐 All States', value: 'All' },
    { label: '🔴 UP Jobs', value: 'UP' },
    { label: '🟡 Bihar Jobs', value: 'Bihar' },
    { label: '🟠 Rajasthan Jobs', value: 'Rajasthan' },
    { label: '🟢 MP Jobs', value: 'MP' },
    { label: '🔵 Delhi Jobs', value: 'Delhi' },
    { label: '🌾 Punjab Jobs', value: 'Punjab' },
    { label: '🚜 Haryana Jobs', value: 'Haryana' },
    { label: '🏔️ Uttarakhand Jobs', value: 'Uttarakhand' },
    { label: '🌊 Odisha Jobs', value: 'Odisha' },
    { label: '🦁 Maharashtra Jobs', value: 'Maharashtra' },
    { label: '🦏 Assam Jobs', value: 'Assam' },
    { label: '⛏️ Jharkhand Jobs', value: 'Jharkhand' },
    { label: '🐯 West Bengal Jobs', value: 'West Bengal' },
    { label: '🛕 Tamil Nadu Jobs', value: 'Tamil Nadu' },
    { label: '☀️ Andhra Pradesh Jobs', value: 'Andhra Pradesh' },
    { label: '❄️ Jammu & Kashmir Jobs', value: 'Jammu & Kashmir' },
    { label: '🏰 Karnataka Jobs', value: 'Karnataka' },
    { label: '🌴 Kerala Jobs', value: 'Kerala' },
    { label: '🪁 Gujarat Jobs', value: 'Gujarat' },
  ];

  const quickTags = [
    { label: 'UPSC', query: 'UPSC' },
    { label: 'SSC CGL', query: 'SSC' },
    { label: 'Railway RRB', query: 'Railway' },
    { label: 'SBI / IBPS', query: 'IBPS' },
    { label: 'Police', query: 'Police' },
    { label: 'NEET / JEE', query: 'NEET' },
    { label: 'CTET', query: 'CTET' },
  ];

  return (
    <div className="bg-gray-100 border-b border-gray-300 py-1 px-3 space-y-1">
      {/* State Filter Buttons - Compact */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="font-extrabold text-red-900 uppercase shrink-0 flex items-center gap-1 text-[11px]">
          🗺️ State Filter:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {states.map((st) => {
            const isActive = selectedState === st.value;
            return (
              <button
                key={st.value}
                onClick={() => onSelectState(st.value)}
                className={`font-bold px-2 py-0.5 rounded transition whitespace-nowrap cursor-pointer text-[11px] border ${
                  isActive
                    ? 'bg-[#b22222] text-white border-red-900 shadow-xs'
                    : 'bg-white hover:bg-red-50 text-gray-900 border-gray-300 hover:border-red-400'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Search Tag Shortcuts - Compact */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none text-xs pt-0.5 border-t border-gray-200">
        <span className="font-extrabold text-blue-900 uppercase shrink-0 text-[11px]">
          🔍 Fast Exams:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => onSearchTag(tag.query)}
              className="bg-white hover:bg-blue-50 text-blue-900 hover:text-red-700 border border-blue-300 hover:border-blue-500 font-semibold px-2 py-0.5 rounded transition whitespace-nowrap cursor-pointer text-[11px]"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
