'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const carouselImageIds = [
  'bestseller-butter-chicken',
  'bestseller-chicken-biryani',
  'Paneer Tikka (6 pcs)',
  'Garlic Naan',
  'Mutton Kasa',
];

const MobileHeroCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const carouselImages = carouselImageIds
    .map(id => PlaceHolderImages.find(img => img.id === id))
    .filter(Boolean);

  if (carouselImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-background pt-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselImages.map((img, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="overflow-hidden rounded-xl aspect-[191/100] relative">
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MobileHeroCarousel;
