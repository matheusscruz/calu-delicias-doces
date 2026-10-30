import React from 'react';

export default function CategoryNav({ categories, selectedCategory, onSelectCategory, products }) {
  return (
    <div className="sticky top-[73px] sm:top-[77px] z-20 bg-[#FFF9FA]/95 backdrop-blur-md py-3 border-b border-[#F7E1E6]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'todos' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D86B88] text-white shadow-sm shadow-[#D86B88]/25 scale-102'
                    : 'bg-white text-[#6B5158] hover:bg-[#FBE9ED] hover:text-[#3B2228] border border-[#F2D7DD]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-[#F5E2E6] text-[#6B5158]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
