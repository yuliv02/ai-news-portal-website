import React, { useState } from 'react';
import { Bell, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', href: '#', active: true },
    { name: 'AI News', href: '#', active: false },
    { name: 'Technology', href: '#', active: false },
    { name: 'Research', href: '#', active: false },
    { name: 'Analysis', href: '#', active: false },
    { name: 'About', href: '#', active: false },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between mb-6 lg:mb-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <div>
              <h1 className="text-white text-lg md:text-xl lg:text-2xl font-medium">Digital Hero</h1>
              <p className="text-purple-200 text-xs md:text-sm">AI News Portal</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors hover:text-white ${
                  item.active
                    ? 'text-white font-medium border-b-2 border-white/60 pb-1'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/10"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden mb-6 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 ${
          mobileMenuOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}>
          <div className="p-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                  item.active
                    ? 'text-white bg-white/20 font-medium'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-medium mb-3">
            Discover the Future of AI
          </h2>
          <p className="text-purple-200 text-sm md:text-base max-w-2xl mx-auto lg:mx-0">
            Stay updated with the latest artificial intelligence news, breakthroughs, and insights from leading sources worldwide.
          </p>
        </div>
      </div>
    </header>
  );
}