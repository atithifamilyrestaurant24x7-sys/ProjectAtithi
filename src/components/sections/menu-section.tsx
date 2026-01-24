

"use client";

import * as React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuCards = [
    { id: 'menu-card-1', name: 'Menu 1' },
    { id: 'menu-card-2', name: 'Menu 2' },
    { id: 'menu-card-3', name: 'Menu 3' },
    { id: 'menu-card-4', name: 'Menu 4' },
    { id: 'menu-card-5', name: 'Menu 5' },
];

const MenuSection = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const scrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const startScrolling = React.useCallback((direction: 'prev' | 'next') => {
        if (scrollIntervalRef.current) return;
        if (!emblaApi) return;
        
        scrollIntervalRef.current = setInterval(() => {
            if (direction === 'next') {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollPrev();
            }
        }, 300);
    }, [emblaApi]);

    const stopScrolling = React.useCallback(() => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    }, []);

    React.useEffect(() => {
        return () => stopScrolling();
    }, [stopScrolling]);

    return (
        <section id="menu" className="py-20 md:py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-4 text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-black">Our Menu</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    A curated selection of authentic Indian dishes, prepared with the freshest ingredients and traditional spices.
                </p>
            </div>

            <div 
              className="w-full relative group/carousel"
            >
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-8 py-4 group">
                        {[...menuCards, ...menuCards].map((card, index) => {
                            const imageData = PlaceHolderImages.find(img => img.id === card.id);
                            return (
                                <div 
                                    key={`${card.id}-${index}`}
                                    className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-8"
                                >
                                     <div className="flex flex-col items-center transition-all duration-300 ease-in-out transform group-hover:blur-[2px] hover:!blur-none hover:scale-125">
                                        <div className={cn(
                                            "relative w-full aspect-[2/3] transition-transform duration-300 ease-in-out"
                                        )}>
                                            {imageData && (
                                                <Image
                                                    src={imageData.imageUrl}
                                                    alt={imageData.description || `Page from Atithi's menu: ${card.name}`}
                                                    fill
                                                    data-ai-hint={imageData.imageHint}
                                                    className="object-contain rounded-lg shadow-lg"
                                                />
                                            )}
                                        </div>
                                        <p className="mt-4 text-sm text-muted-foreground font-medium">{card.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Manual Navigation Buttons */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={scrollPrev}
                        className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-30 ml-4"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={scrollNext}
                        className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-30 mr-4"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
                
                {/* Hover scroll zones */}
                 <div 
                    className="absolute top-0 left-0 h-full w-1/4 z-20"
                    onMouseEnter={() => startScrolling('prev')}
                    onMouseLeave={stopScrolling}
                />
                <div 
                    className="absolute top-0 right-0 h-full w-1/4 z-20"
                    onMouseEnter={() => startScrolling('next')}
                    onMouseLeave={stopScrolling}
                />
            </div>
        </section>
    );
};

export default MenuSection;
