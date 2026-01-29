"use client";

import { cn } from "@/lib/utils";

// Hero Section Skeleton
export function HeroSkeleton() {
    return (
        <div className="relative h-screen w-full bg-gradient-to-b from-amber-900/20 to-amber-800/10 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-16 w-64 mx-auto bg-amber-200/30 rounded-lg" />
                    <div className="h-8 w-48 mx-auto bg-amber-200/20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Product Card Skeleton
export function ProductCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("bg-card rounded-[30px] border overflow-hidden", className)}>
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted/70 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-4 w-4 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-primary/20 rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

// Mobile Product Card Skeleton
export function MobileProductCardSkeleton() {
    return (
        <div className="grid grid-cols-[80px_1fr] gap-3 w-full bg-card rounded-xl shadow-sm p-3">
            {/* Image */}
            <div className="w-20 h-20 bg-muted rounded-lg animate-pulse" />
            {/* Content */}
            <div className="space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-8 bg-muted/70 rounded animate-pulse" />
                </div>
                <div className="h-3 w-full bg-muted/60 rounded animate-pulse" />
                <div className="flex justify-between items-center">
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-20 bg-primary/20 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

// Category Grid Skeleton for Mobile
export function CategoryGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 px-4 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-[14px] animate-pulse" />
            ))}
        </div>
    );
}

// Carousel Skeleton
export function CarouselSkeleton() {
    return (
        <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} className="flex-shrink-0 w-[280px]" />
            ))}
        </div>
    );
}

// Recommendation Section Skeleton
export function RecommendationSkeleton() {
    return (
        <div className="p-6 bg-card rounded-2xl border space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
            <div className="flex gap-3 pt-4">
                <div className="h-10 flex-1 bg-primary/20 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
            </div>
        </div>
    );
}
