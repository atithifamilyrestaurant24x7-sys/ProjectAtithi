
"use client";

import { useState, useEffect } from "react";
import { config } from "@/lib/utils";
import Link from "next/link";
import { InstagramIcon, GoogleMapsIcon, CallIcon } from "@/components/icons";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

const socialLinks = [
  { name: 'Instagram', href: '#', icon: InstagramIcon, isExternal: false, dataSocial: 'instagram' },
  { name: 'Google Maps', href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, isExternal: true, dataSocial: 'google-maps' },
  { name: 'Call', href: 'tel:8250104315', icon: CallIcon, isExternal: true, dataSocial: 'call' },
];

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">{config.brandName}</h3>
            <p className="text-muted-foreground text-white/60">{config.description}</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#contact" className="text-white/60 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <ul className="example-2 justify-center md:justify-start -ml-[10px]">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                const iconLink = (
                    <a
                        href={social.href}
                        data-social={social.dataSocial}
                        target={social.isExternal ? "_blank" : undefined}
                        rel={social.isExternal ? "noopener noreferrer" : undefined}
                        aria-label={social.name}
                        onClick={!social.isExternal ? (e) => e.preventDefault() : undefined}
                        className="!bg-white/10 !text-white/80"
                    >
                        <div className="filled"></div>
                        <Icon />
                    </a>
                );
                
                return (
                    <li key={social.name}>
                        <div className="icon-content">
                            {social.isExternal ? iconLink : <ComingSoonDialog>{iconLink}</ComingSoonDialog>}
                            <div className="tooltip">{social.name}</div>
                        </div>
                    </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-white/50">
          {currentYear !== null && <p>&copy; {currentYear} {config.fullName}. All Rights Reserved.</p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
