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
  'bestseller-chicken-biryani',
  'bestseller-butter-chicken',
  'Paneer Tikka (6 pcs)',
  'Garlic Naan',
  'Chicken Kasa',
];

type MobileHeroCarouselProps = {
  onCardClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
};


const MobileHeroCarousel = ({ onCardClick, onAddToCart }: MobileHeroCarouselProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  const allItems = menuData.flatMap(c => c.items);
  const carouselImages = carouselImageIds
    .map(id => {
        const img = PlaceHolderImages.find(pImg => pImg.id === id);
        if (!img) return { img: null, menuItem: null };
        
        let menuItem = allItems.find(item => item.name === id);
        if (!menuItem) {
            // For bestseller items, the ID is different from the name.
            // We can match them using the image description.
            if (id.startsWith('bestseller-')) {
                menuItem = allItems.find(item => item.name === img.description);
            }
        }
        
        return { img, menuItem };
    })
    .filter((item): item is { img: NonNullable<typeof item.img>, menuItem: NonNullable<typeof item.menuItem> } => !!item.img && !!item.menuItem);


  if (carouselImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-background pt-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselImages.map(({ img, menuItem }, index) => (
            <CarouselItem key={index} className="basis-full" onClick={() => onCardClick(menuItem)}>
              <div className="overflow-hidden rounded-xl aspect-[191/100] relative">
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {menuItem && (
                  <div className="absolute bottom-4 left-4 text-white text-lg font-bold drop-shadow-md">
                    {menuItem.name}
                  </div>
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
