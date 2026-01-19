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
import { type MenuItem, menuData } from '@/lib/menu';

const carouselImageIds = [
  'bestseller-butter-chicken',
  'bestseller-chicken-biryani',
  'Paneer Tikka (6 pcs)',
  'Garlic Naan',
  'Mutton Kasa',
];

type MobileHeroCarouselProps = {
  onCardClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
};


const MobileHeroCarousel = ({ onCardClick, onAddToCart }: MobileHeroCarouselProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const carouselImages = carouselImageIds
    .map(id => {
        const img = PlaceHolderImages.find(img => img.id === id);
        // This is a hack. The item might not be in menuData.
        const menuItem = menuData.flatMap(c => c.items).find(i => i.name === id);
        return { img, menuItem };
    })
    .filter(({img, menuItem}) => img && menuItem);

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
          {carouselImages.map(({ img, menuItem }, index) => (
            <CarouselItem key={index} className="basis-full" onClick={() => menuItem && onCardClick(menuItem)}>
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
