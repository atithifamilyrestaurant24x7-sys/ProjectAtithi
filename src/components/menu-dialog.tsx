
"use client";

import * as React from "react";
import { useRef, useState, forwardRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HTMLFlipBook from "react-pageflip";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const menuCards = [
  { id: 'menu-card-1', name: 'Menu Page 1' },
  { id: 'menu-card-2', name: 'Menu Page 2' },
  { id: 'menu-card-3', name: 'Menu Page 3' },
  { id: 'menu-card-4', name: 'Menu Page 4' },
  { id: 'menu-card-5', name: 'Menu Page 5' },
];

// Page component with forwardRef for react-pageflip
const Page = forwardRef<HTMLDivElement, { imageData: { imageUrl: string; description?: string } | undefined; name: string; pageNumber: number }>(
  ({ imageData, name, pageNumber }, ref) => {
    return (
      <div className="page bg-[#fdfbf5] shadow-md h-full w-full" ref={ref}>
        {/* Paper texture effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/[0.02] to-black/[0.05] pointer-events-none z-10"></div>

        <div className="relative w-full h-full flex items-center justify-center p-3">
          {imageData ? (
            <div className="relative w-full h-full">
              <Image
                src={imageData.imageUrl}
                alt={imageData.description || name}
                fill
                sizes="(max-width: 768px) 280px, 400px"
                className="object-contain"
                loading="lazy"
                quality={75}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white/50">
              <span className="text-muted-foreground font-serif text-lg">{name}</span>
              <span className="text-xs text-muted-foreground mt-2">Image coming soon</span>
            </div>
          )}
        </div>

        {/* Page Number */}
        <div className="absolute bottom-3 right-4 z-20 font-serif text-xs text-gray-400">
          {pageNumber}
        </div>

        {/* Page fold effect on right side */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-10"></div>
      </div>
    );
  }
);

Page.displayName = "Page";

export function MenuDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBook = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = menuCards.length;

  const goToPrevPage = () => {
    flipBook.current?.pageFlip()?.flipPrev();
  };

  const goToNextPage = () => {
    flipBook.current?.pageFlip()?.flipNext();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] md:h-auto md:max-h-[90vh] p-0 gap-0 bg-gradient-to-b from-[#2a2520] to-[#1a1815] flex flex-col overflow-hidden max-w-[95vw] md:max-w-3xl">
        <DialogHeader className="p-4 md:p-5 bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/20 shrink-0 z-20 relative">
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-xl md:text-2xl font-serif text-primary">Our Full Menu</DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-white/60">
                Swipe or click buttons to flip pages
              </DialogDescription>
            </div>
          </div>
          {/* Custom Close Button for visibility on dark bg */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-50 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex-grow relative flex flex-col items-center justify-center h-full overflow-hidden py-4 md:py-6">

          {/* Book Container */}
          <div className="relative w-full flex justify-center items-center" style={{ height: 'calc(100% - 60px)' }}>
            {/* Book shadow underneath */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/30 blur-xl rounded-full"></div>

            <HTMLFlipBook
              width={280}
              height={400}
              size="stretch"
              minWidth={200}
              maxWidth={400}
              minHeight={300}
              maxHeight={550}
              showCover={false}
              mobileScrollSupport={true}
              className="book-flip shadow-2xl"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={600}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.4}
              showPageCorners={true}
              disableFlipByClick={false}
              swipeDistance={30}
              clickEventForward={true}
              useMouseEvents={true}
              ref={flipBook}
              onFlip={onFlip}
            >
              {menuCards.map((card, index) => {
                const imageData = PlaceHolderImages.find(img => img.id === card.id);
                return (
                  <Page
                    key={card.id}
                    imageData={imageData}
                    name={card.name}
                    pageNumber={index + 1}
                  />
                );
              })}
            </HTMLFlipBook>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30">
            <div className="bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-full flex items-center gap-3 text-sm font-medium shadow-lg border border-white/10">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="min-w-[50px] text-center">{currentPage + 1} / {totalPages}</span>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
