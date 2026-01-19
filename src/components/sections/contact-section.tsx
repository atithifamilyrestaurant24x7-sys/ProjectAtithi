
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { WhatsappIcon } from '../icons';

const contactDetails = [
    {
        icon: MapPin,
        title: 'Location',
        containerClass: 'containerOne',
        href: 'https://www.google.com/maps/place/Atithi+Family+Restaurant/@24.2027813,87.7959755,17z/data=!4m12!1m5!3m4!2zMjTCsDEyJzEwLjAiTiA4N8KwNDcnNTQuOCJF!8m2!3d24.2027764!4d87.7985504!3m5!1s0x39fa1ec0ffee3159:0x79903c862e585ea1!8m2!3d24.2024486!4d87.7985075!16s%2Fg%2F11c5_nvjc3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D',
        isExternal: true,
    },
    {
        icon: Phone,
        title: 'Phone',
        containerClass: 'containerTwo',
        href: 'tel:8250104315',
        isExternal: true,
    },
    {
        icon: WhatsappIcon,
        title: 'WhatsApp',
        containerClass: 'containerFour',
        href: 'https://wa.me/918250104315',
        isExternal: true,
    },
    {
        icon: Mail,
        title: 'Email',
        containerClass: 'containerThree',
        href: '#',
        isExternal: false,
    }
];

const ContactSection = () => {
    return (
        <section id="contact" className="py-12 md:py-32 bg-secondary/30 scroll-mt-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Get In Touch</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="animated-social-links">
                    {contactDetails.map((detail, index) => {
                        const Icon = detail.icon;
                        
                        if (detail.isExternal) {
                            return (
                                <Link
                                    key={index}
                                    href={detail.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={detail.title}
                                    className={`socialContainer ${detail.containerClass}`}
                                >
                                    <Icon className="socialSvg" />
                                </Link>
                            );
                        }

                        return (
                            <ComingSoonDialog key={index}>
                                <button className={`socialContainer ${detail.containerClass}`}>
                                    <Icon className="socialSvg" />
                                </button>
                            </ComingSoonDialog>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
