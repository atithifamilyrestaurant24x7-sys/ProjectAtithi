"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { config, SectionData } from "@/lib/utils";
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
  const [currentSection] = useState<SectionData>(config.sections[0]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Responsive split for Desktop Animation vs Mobile Performance */}
      <div className="absolute inset-0 z-[-1] bg-black">
        {/* Desktop: Animated WebP (Unoptimized to play animation) */}
        <div className="hidden md:block absolute inset-0">
          {/* Using standard img tag to ensure animated WebP plays without Next.js processing */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
            alt="Atithi Family Restaurant Ambience"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Mobile: Optimized Static Image (Better performance) */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1080&q=75"
            alt="Atithi Family Restaurant Ambience"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ANf0y8eWR4ZkKSRnBwQQfxgfRUy+vrmzvJ4IriVYo3KojMSFAPAFKUcEMC+Zex5J/9k="
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 h-full">
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 w-full px-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button size="lg" variant="outline" className="border-2 border-white/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm" asChild>
                <Link href="#products">Explore Menu</Link>
              </Button>
              <Button size="lg" className="text-white backdrop-blur-sm bg-black/20 hover:bg-black/30" style={{ backgroundColor: currentSection.themeColor }} asChild>
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
