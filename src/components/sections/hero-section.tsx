"use client";

import Link from "next/link";
import { config } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { InstagramIcon, GoogleMapsIcon, CallIcon, WhatsappIcon } from "@/components/icons";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

const socialLinks = [
  { name: 'Instagram', href: '#', icon: InstagramIcon, isExternal: false },
  { name: 'WhatsApp', href: 'https://wa.me/918250104315', icon: WhatsappIcon, isExternal: true },
  { name: 'Google Maps', href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, isExternal: true },
  { name: 'Call', href: 'tel:8250104315', icon: CallIcon, isExternal: true },
];

type HeroSectionProps = {};

const HeroSection = ({ }: HeroSectionProps) => {


  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Responsive split for Desktop Animation vs Mobile Performance */}
      <div className="absolute inset-0 z-[-1] bg-black">
        {/* Desktop: Animated WebP (Unoptimized to play animation) */}
        <div className="hidden md:block absolute inset-0">
          {/* Using standard img tag to ensure animated WebP plays without Next.js processing */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <video
            src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/Banner/hero%20video%201.webm"
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/Banner/banner-one.webp"
          />
        </div>

        {/* Mobile: Optimized Static Image (Better performance) */}

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 h-full">
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 w-full px-4">
            {/* Hidden H1 for SEO, visual text is in the video */}
            <h1 className="sr-only">
              {config.fullName}
            </h1>
            <p className="sr-only">
              {config.description}
            </p>
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
                        <social.icon className="h-6 w-6" />
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
                    <social.icon className="h-6 w-6" />
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
