import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Clock, Calendar, MessageSquare, HeartHandshake, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "Dashboard", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Prayer Times", href: "/prayer-times", icon: <Clock className="h-4 w-4 mr-2" /> },
    { name: "Events", href: "/events", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: "Announcements", href: "/announcements", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: "Donations", href: "/donations", icon: <HeartHandshake className="h-4 w-4 mr-2" /> },
    { name: "Admin", href: "/admin", icon: <Shield className="h-4 w-4 mr-2" /> }
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="bg-primary text-white shadow-md z-10 sticky w-full top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 22h20V10L12 2 2 10v12zm10-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-arabic tracking-wide">Masjid Al-Hikmah</h1>
              <p className="text-xs md:text-sm opacity-80">Sistem Manajemen Masjid</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.slice(0, 5).map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={`hover:text-primary-light transition flex items-center ${isActive(link.href) ? 'text-white font-medium' : 'text-white/80'}`}>
                  {link.icon}
                  {link.name}
                </a>
              </Link>
            ))}
            <Link href="/admin">
              <Button variant="secondary" className="bg-primary-dark hover:bg-primary-light text-white">
                Admin
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none" 
              aria-label="Toggle mobile menu"
            >
              <span className="material-icons">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a 
                    className={`hover:text-primary-light transition py-2 flex items-center ${isActive(link.href) ? 'text-white font-medium' : 'text-white/80'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
