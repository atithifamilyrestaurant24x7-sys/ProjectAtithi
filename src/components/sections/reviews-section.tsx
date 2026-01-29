"use client";

import * as React from "react";
import { type Review } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', containScroll: 'trimSnaps' });

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section id="reviews" className="py-20 md:py-32 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 md:mb-16 px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                        Guest Stories
                    </h2>
                    <p className="mt-4 text-[11px] md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Real experiences from our valued guests who have dined with us.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 md:px-12">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-6 py-4">
                            {reviews.map((review, index) => {
                                // Extract initials for Avatar
                                const initials = review.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <div key={`${review.name}-${index}`} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_35%] pl-6 flex justify-center">
                                        <div className="w-full bg-card rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center h-full min-h-[320px]">

                                            {/* Stars Row */}
                                            <div className="flex gap-1 mb-6 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                                                ))}
                                            </div>

                                            {/* Quote Icon Background */}
                                            <div className="absolute top-6 left-6 opacity-10">
                                                <Quote size={48} className="text-primary" />
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-muted-foreground text-base leading-relaxed flex-grow line-clamp-6 mb-6 relative z-10">
                                                "{review.review}"
                                            </p>

                                            {/* User Info */}
                                            <div className="flex items-center gap-3 mt-auto w-full justify-center border-t border-border pt-4">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${review.name}&background=random`} alt={review.name} />
                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-left">
                                                    <h3 className="font-semibold text-sm text-foreground">{review.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{review.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons - Visible on Desktop, Hidden on Mobile (Swipe only) */}
                    <div className="hidden md:block">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 h-12 w-12 rounded-full border-border bg-background shadow-lg hover:bg-accent hover:text-accent-foreground z-10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 h-12 w-12 rounded-full border-border bg-background shadow-lg hover:bg-accent hover:text-accent-foreground z-10"
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
