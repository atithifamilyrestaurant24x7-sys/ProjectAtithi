
"use client";

import { useState, useEffect } from "react";
import { config } from "@/lib/utils";
import Link from "next/link";
import { InstagramIcon, GoogleMapsIcon, CallIcon, WhatsappIcon } from "@/components/icons";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const socialLinks = [
  { name: 'Instagram', href: '#', icon: InstagramIcon, isExternal: false },
  { name: 'WhatsApp', href: 'https://wa.me/918250104315', icon: WhatsappIcon, isExternal: true },
  { name: 'Google Maps', href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', icon: GoogleMapsIcon, isExternal: true },
  { name: 'Call', href: 'tel:8250104315', icon: CallIcon, isExternal: true },
];

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="bg-[#1a1a1a] text-white py-12 md:py-16 relative overflow-hidden">
      {/* Decorative gradient blob for mobile */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl md:hidden pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl md:hidden pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">

          {/* Brand & Description */}
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-primary/10 p-3 rounded-2xl w-fit mb-2 md:mb-0">
              <h3 className="text-3xl font-bold text-primary tracking-tight">{config.brandName}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs md:max-w-none">
              {config.description}
            </p>
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row gap-10 md:justify-around w-full">

            {/* Mobile Accordion View */}
            <div className="md:hidden w-full space-y-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="quick-links" className="border-white/10">
                  <AccordionTrigger className="text-lg font-bold text-white/90 hover:no-underline">Quick Links</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 pt-2 text-left pl-2">
                      <li><Link href="/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all duration-300 block py-1">About</Link></li>
                      <li><Link href="#contact" className="text-gray-400 hover:text-primary transition-all duration-300 block py-1">Contact</Link></li>
                      <li><Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all duration-300 block py-1">Privacy Policy</Link></li>
                      <li><Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all duration-300 block py-1">Terms of Service</Link></li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact-us" className="border-white/10">
                  <AccordionTrigger className="text-lg font-bold text-white/90 hover:no-underline">Contact Us</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 pt-2 text-left pl-2">
                      <li className="flex items-start text-gray-400">
                        <GoogleMapsIcon className="w-5 h-5 mr-3 mt-1 text-primary shrink-0" />
                        <span>Atithi Family Restaurant, NH 34, Gazole, Malda, West Bengal 732124</span>
                      </li>
                      <li className="flex items-center text-gray-400">
                        <CallIcon className="w-5 h-5 mr-3 text-primary shrink-0" />
                        <a href="tel:8250104315" className="hover:text-primary transition-colors">+91 82501 04315</a>
                      </li>
                      <li className="flex items-center text-gray-400">
                        <WhatsappIcon className="w-5 h-5 mr-3 text-primary shrink-0" />
                        <a href="https://wa.me/918250104315" target="_blank" className="hover:text-primary transition-colors">Chat on WhatsApp</a>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Always Visible Social Icons on Mobile */}
              <div className="pt-8 pb-4 flex flex-col items-center justify-center">
                <p className="text-white/60 text-sm mb-4 font-medium uppercase tracking-wider">Follow Us</p>
                <ul className="flex items-center justify-center gap-5">
                  {socialLinks.map((social) => {
                    const buttonClasses = "w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/5";

                    const linkContent = (
                      <a
                        href={social.href}
                        target={social.isExternal ? "_blank" : undefined}
                        rel={social.isExternal ? "noopener noreferrer" : undefined}
                        aria-label={social.name}
                        className={buttonClasses}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    );

                    if (!social.isExternal) {
                      return (
                        <li key={social.name}>
                          <ComingSoonDialog>
                            <button className={buttonClasses} suppressHydrationWarning>
                              <social.icon className="h-5 w-5" />
                              <span className="sr-only">{social.name}</span>
                            </button>
                          </ComingSoonDialog>
                        </li>
                      );
                    }

                    return (
                      <li key={social.name}>
                        {linkContent}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <h4 className="font-bold text-lg mb-6 text-white/90 relative inline-block">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li><Link href="/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary hover:pl-2 transition-all duration-300 inline-block">About</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-primary hover:pl-2 transition-all duration-300 inline-block">Contact</Link></li>
                <li><Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary hover:pl-2 transition-all duration-300 inline-block">Privacy Policy</Link></li>
                <li><Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary hover:pl-2 transition-all duration-300 inline-block">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="hidden md:block">
              <h4 className="font-bold text-lg mb-6 text-white/90">Connect With Us</h4>
              <div className="flex flex-col items-start space-y-4">
                <ul className="flex items-center justify-start gap-4">
                  {socialLinks.map((social) => {
                    const buttonClasses = "w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/5";
                    const linkContent = (
                      <a
                        href={social.href}
                        target={social.isExternal ? "_blank" : undefined}
                        rel={social.isExternal ? "noopener noreferrer" : undefined}
                        aria-label={social.name}
                        className={buttonClasses}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    );
                    if (!social.isExternal) {
                      return (
                        <li key={social.name}>
                          <ComingSoonDialog>
                            <button className={buttonClasses} suppressHydrationWarning>
                              <social.icon className="h-5 w-5" />
                              <span className="sr-only">{social.name}</span>
                            </button>
                          </ComingSoonDialog>
                        </li>
                      );
                    }
                    return (
                      <li key={social.name}>
                        {linkContent}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear ?? '...'} <span className="text-gray-300 font-medium">{config.fullName}</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
