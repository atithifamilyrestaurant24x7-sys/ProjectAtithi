
"use client";

import * as React from "react";
import { type Review } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    
    return (
        <section id="reviews" className="py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Words from Our Guests</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We are proud to be a part of so many wonderful journeys. Here's what our valued customers have to say.
                    </p>
                </div>

                <div className="relative group/carousel">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-8 py-4">
                            {reviews.map((review, index) => {
                                return (
                                    <div key={`${review.name}-${index}`} className="flex-[0_0_280px] min-w-0 pl-8 flex items-center justify-center">
                                        <div className="book">
                                            <div className="inner">
                                                <p className="text-sm text-muted-foreground italic p-4">"{review.review}"</p>
                                            </div>
                                            <div className="cover">
                                                <div className="text-center p-4">
                                                    <p className="font-bold text-lg">{review.name}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{review.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={scrollPrev}
                            className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10 ml-4"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={scrollNext}
                            className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10 mr-4"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
