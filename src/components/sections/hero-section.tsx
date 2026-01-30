
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { config } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { InstagramIcon, GoogleMapsIcon, CallIcon, WhatsappIcon } from "@/components/icons";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { cn } from "@/lib/utils";

const socialLinks = [
  { name: 'Instagram', href: '#', icon: InstagramIcon, isExternal: false },
  { name: 'WhatsApp', href: 'https://wa.me/918250104315', icon: WhatsappIcon, isExternal: true },
  { name: 'Google Maps', href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, isExternal: true },
  { name: 'Call', href: 'tel:8250104315', icon: CallIcon, isExternal: true },
];

const HeroSection = () => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (isVideoLoading) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 99) {
            clearInterval(interval);
            return 99;
          }
          return prev + 1;
        });
      }, 40); // Simulate loading over ~4 seconds

      return () => clearInterval(interval);
    } else {
      // When video is ready, complete the progress bar before fading out
      const timer = setTimeout(() => setLoadProgress(100), 100);
      return () => clearTimeout(timer);
    }
  }, [isVideoLoading]);

  const handleVideoCanPlay = () => {
    // Set a small delay before hiding the loader to ensure a smooth transition
    setTimeout(() => {
      setIsVideoLoading(false);
    }, 500);
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Loading Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-1000",
          !isVideoLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <h2 className="text-white text-3xl font-serif mb-4 tracking-wider">Welcome to Atithi</h2>
        <div className="w-56 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="text-white/80 mt-2 text-sm font-mono">{loadProgress}%</p>
      </div>

      {/* Background Video */}
      <div className="absolute inset-0 z-[-1] bg-black">
        <video
          src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/Banner/hero%20video%201.webm"
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/Banner/banner-one.webp"
          onCanPlay={handleVideoCanPlay}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 h-full">
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <div className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 w-full px-4 transition-opacity duration-1000 delay-500",
            isVideoLoading ? "opacity-0" : "opacity-100"
          )}>
            {/* Hidden H1 for SEO */}
            <h1 className="sr-only">{config.fullName}</h1>
            <p className="sr-only">{config.description}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button size="lg" variant="outline" className="border-2 border-white/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm" asChild>
                <Link href="#products">Explore Menu</Link>
              </Button>
              <Button size="lg" className="text-white backdrop-blur-sm bg-black/20 hover:bg-black/30" style={{ backgroundColor: '#C9A24D' }} asChild>
                <Link href="tel:8250104315">
                  <Phone className="mr-2 h-5 w-5" /> Call to Book
                </Link>
              </Button>
            </div>

            {/* Bottom Socials */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                if (!social.isExternal) {
                  return (
                    <ComingSoonDialog key={social.name}>
                      <button className="text-white/80 hover:text-white transition-colors" suppressHydrationWarning>
                        <social.icon className="h-5 w-5" />
                        <span className="sr-only">{social.name}</span>
                      </button>
                    </ComingSoonDialog>
                  );
                }

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target={social.isExternal ? "_blank" : undefined}
                    rel={social.isExternal ? "noopener noreferrer" : undefined}
                    aria-label={social.name}
                    className="text-white/80 hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
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
