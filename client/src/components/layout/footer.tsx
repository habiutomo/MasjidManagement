import { Link } from "wouter";
import { Facebook, Globe, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Masjid Al-Hikmah</h3>
            <p className="text-sm opacity-80">A place of worship, learning, and community service dedicated to serving the Muslim community.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-light transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-light transition">
                <Globe size={20} />
              </a>
              <a href="#" className="hover:text-primary-light transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="hover:text-primary-light transition">Dashboard</a></Link></li>
              <li><Link href="/prayer-times"><a className="hover:text-primary-light transition">Prayer Times</a></Link></li>
              <li><Link href="/events"><a className="hover:text-primary-light transition">Events</a></Link></li>
              <li><Link href="/announcements"><a className="hover:text-primary-light transition">Announcements</a></Link></li>
              <li><Link href="/donations"><a className="hover:text-primary-light transition">Donations</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Jl. Masjid No. 123, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>info@masjidalhikmah.id</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Prayer Times</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Fajr</span>
                <span>05:12 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Dhuhr</span>
                <span>12:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Asr</span>
                <span>15:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Maghrib</span>
                <span>17:45 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Isha</span>
                <span>19:15 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary text-center">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Masjid Al-Hikmah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
