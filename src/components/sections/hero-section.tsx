"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { config, SectionData } from "@/app/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { InstagramIcon, GoogleMapsIcon, CallIcon, WhatsappIcon } from "@/components/icons";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

const socialLinks = [
    { name: 'Instagram', href: '#', icon: InstagramIcon, isExternal: false },
    { name: 'WhatsApp', href: 'https://wa.me/918250104315', icon: WhatsappIcon, isExternal: true },
    { name: 'Google Maps', href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, isExternal: true },
    { name: 'Call', href: 'tel:8250104315', icon: CallIcon, isExternal: true },
];

type HeroSectionProps = {
  onMenuClick: () => void;
};

const HeroSection = ({ onMenuClick }: HeroSectionProps) => {
  const [currentSection] = useState<SectionData>(config.sections[0]);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-accent', currentSection.themeColor);
  }, [currentSection]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-[-1] bg-black">
      <video
          key="hero-video"
          src="https://ydaeoeawwmggwuwxjqqz.supabase.co/storage/v1/object/public/asset/Create_an_animation_1080p_202601041221.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Menu Trigger Button */}
      <div className="absolute top-5 left-5 z-[60] md:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-white bg-black/20 hover:bg-black/40 hover:text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Navigation</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 h-full">
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 w-full px-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button size="lg" variant="outline" className="border-2 border-white/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm" asChild>
                  <Link href="#menu">Explore Menu</Link>
                </Button>
                <Button size="lg" className="text-white backdrop-blur-sm bg-black/20 hover:bg-black/30" style={{backgroundColor: "var(--dynamic-accent, #C9A24D)"}} asChild>
                  <Link href="tel:8250104315">
                    <Phone className="mr-2 h-5 w-5" /> Call to Book
                  </Link>
                </Button>
              </div>
          
              {/* Bottom Socials */}
              <div className="flex space-x-6">
                {socialLinks.map((social) => {
                    const socialIcon = (
                      <button className="text-white/80 hover:text-white transition-colors">
                        <social.icon className="h-6 w-6" />
                        <span className="sr-only">{social.name}</span>
                      </button>
                    );
  
                    if (social.isExternal) {
                      return (
                        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                          {socialIcon}
                        </a>
                      );
                    }
  
                    return (
                      <ComingSoonDialog key={social.name}>
                        {socialIcon}
                      </ComingSoonDialog>
                    );
                })}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
