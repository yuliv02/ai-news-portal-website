import React from 'react';
import { Button } from './ui/button';
import { CATEGORIES } from './constants';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Category Header - Hidden on mobile */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-medium">Browse by Category</h3>
          <span className="text-purple-200 text-xs">
            {selectedCategory === 'all' ? 'All categories' : selectedCategory}
          </span>
        </div>
        
        {/* Category Buttons */}
        <div className="flex gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={`whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-white text-purple-700 hover:bg-white/90 shadow-md'
                : 'text-white border-white/20 hover:bg-white/10 hover:border-white/40'
            }`}
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-purple-700 hover:bg-white/90 shadow-md'
                  : 'text-white border-white/20 hover:bg-white/10 hover:border-white/40'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}