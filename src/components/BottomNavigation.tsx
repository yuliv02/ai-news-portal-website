import React from 'react';
import { Home, User, Settings } from 'lucide-react';
import { Button } from './ui/button';

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="flex justify-center items-center py-4">
        <div className="flex gap-8">
          <Button variant="ghost" size="icon" className="text-blue-200 hover:bg-white/10">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-200 hover:bg-white/10">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-purple-200 hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}