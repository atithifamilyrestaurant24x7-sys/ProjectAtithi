'use client';

import Link from 'next/link';
import { Home, List, ShoppingCart, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GoogleMapsIcon } from './icons';

type MobileBottomNavProps = {
  cartCount: number;
  onCartClick: () => void;
};

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '#products', icon: List, label: 'Menu' },
  { href: 'cart', icon: ShoppingCart, label: 'Cart' },
  { href: '#contact', icon: Phone, label: 'Contact' },
  { href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, label: 'Location' },
];

export function MobileBottomNav({ cartCount, onCartClick }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-40">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isExternal = item.href.startsWith('http');
          
          if (item.href === 'cart') {
            return (
              <button
                key={item.label}
                onClick={onCartClick}
                className="relative flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors group"
              >
                <item.icon className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{item.label}</span>
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute top-1 right-1/2 translate-x-3 h-5 w-5 flex items-center justify-center rounded-full p-1 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </button>
            );
          }

          const linkContent = (
             <>
                <item.icon className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{item.label}</span>
             </>
          );

          const linkClassName = "flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary transition-colors group";

          if (isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {linkContent}
              </a>
            );
          }
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={linkClassName}
            >
              {linkContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
