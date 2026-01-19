'use client';

import * as React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const bannerImages = [
    "https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(5).png",
    "https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/image%20(6).png"
];

const BannerCarousel = () => {
    const autoplayPlugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );

    const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplayPlugin.current]);

    return (
        <div className="banner-fade-carousel" ref={emblaRef}>
            <div className="banner-fade-carousel__container">
                {bannerImages.map((src, index) => (
                    <div className="banner-fade-carousel__slide" key={index}>
                        <Image
                            src={src}
                            alt={`Special Offer Banner ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
