import Link from "next/link";
import { Mail, Phone, MapPin, Globe, MessageCircle, PlayCircle, Video } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-gradient font-heading font-bold text-3xl tracking-tighter">
              Ease Your Needs
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Your comprehensive platform for automated event orchestration, Zoom rentals, and studio bookings.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Globe size={20} />
              </Link>
              <Link href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <MessageCircle size={20} />
              </Link>
              <Link href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <PlayCircle size={20} />
              </Link>
              <Link href="#" className="p-2 bg-muted rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Video size={20} />
              </Link>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground">Products</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Zoom Rentals</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Event Operator</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">MC & Moderator</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Broadcasting</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground">Company</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-foreground">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={20} />
                <span className="text-muted-foreground">Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <span className="text-muted-foreground">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <span className="text-muted-foreground">hello@easeyourneeds.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Ease Your Needs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
