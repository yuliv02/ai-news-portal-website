import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for AI insights, topics, or authors..."
                value={searchTerm}
                onChange={onSearch}
                className="pl-10 pr-4 py-2 md:py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20 focus:border-white/40 rounded-lg text-sm md:text-base"
              />
            </div>
            
            {/* Advanced Filter Button - Hidden on small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-white hover:bg-white/10 border-white/20 border"
              aria-label="Advanced filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search suggestions or quick filters could go here */}
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg z-10 max-h-48 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2 px-2">Quick suggestions:</div>
                <div className="space-y-1">
                  {['AI ethics', 'Machine learning', 'Neural networks', 'Automation'].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => {
                        const event = {
                          target: { value: suggestion }
                        } as React.ChangeEvent<HTMLInputElement>;
                        onSearch(event);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}