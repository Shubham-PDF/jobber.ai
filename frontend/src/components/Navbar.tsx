import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X, Coins } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignout = () => {
    signout();
    navigate('/');
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#' + id);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-lg font-bold tracking-wider text-white uppercase transition-all duration-300 group-hover:text-neutral-300">
                jobber<span className="text-neutral-500 font-normal">.ai</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305">
              Home
            </Link>
            <button 
              onClick={() => handleScrollTo('why-us')}
              className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305 cursor-pointer bg-transparent border-0 p-0"
            >
              Why Us
            </button>
            <button 
              onClick={() => handleScrollTo('how-to-use')}
              className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305 cursor-pointer bg-transparent border-0 p-0"
            >
              How to Use
            </button>
            <button 
              onClick={() => handleScrollTo('pricing')}
              className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305 cursor-pointer bg-transparent border-0 p-0"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleScrollTo('contact')}
              className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305 cursor-pointer bg-transparent border-0 p-0"
            >
              Contact
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Coins className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-xs font-semibold text-neutral-200 tracking-wide">{user.credits} Credits</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link to="/signin" className="text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white transition-colors duration-305">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded bg-white text-black text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-neutral-200 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/5 px-6 py-4 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white"
          >
            Home
          </Link>
          <button
            onClick={() => handleScrollTo('why-us')}
            className="block text-left w-full text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white bg-transparent border-0 p-0"
          >
            Why Us
          </button>
          <button
            onClick={() => handleScrollTo('how-to-use')}
            className="block text-left w-full text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white bg-transparent border-0 p-0"
          >
            How to Use
          </button>
          <button
            onClick={() => handleScrollTo('pricing')}
            className="block text-left w-full text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white bg-transparent border-0 p-0"
          >
            Pricing
          </button>
          <button
            onClick={() => handleScrollTo('contact')}
            className="block text-left w-full text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white bg-transparent border-0 p-0"
          >
            Contact
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Coins className="w-4 h-4" />
                <span>{user.credits} Credits Available</span>
              </div>
              <div className="text-xs text-neutral-500">
                Account: <span className="text-white font-medium">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-red-950/20 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-medium uppercase tracking-wider text-neutral-450 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded bg-white text-black text-xs font-semibold uppercase tracking-wider"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
