
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const menuCards = [
    { id: 'menu-card-1', name: 'Menu Page 1' },
    { id: 'menu-card-2', name: 'Menu Page 2' },
    { id: 'menu-card-3', name: 'Menu Page 3' },
    { id: 'menu-card-4', name: 'Menu Page 4' },
    { id: 'menu-card-5', name: 'Menu Page 5' },
];

export function MenuDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-full md:h-auto max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Our Full Menu</DialogTitle>
          <DialogDescription>
            Swipe or scroll to browse through our menu.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-8 pr-6">
              {menuCards.map((card, index) => {
                const imageData = PlaceHolderImages.find(img => img.id === card.id);
                return (
                  <div key={card.id} className="w-full">
                    <div className="relative aspect-[2/3] w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg border">
                      {imageData ? (
                        <Image
                          src={imageData.imageUrl}
                          alt={imageData.description || `Page from Atithi's menu: ${card.name}`}
                          fill
                          data-ai-hint={imageData.imageHint}
                          className="object-contain"
                          priority={index === 0}
                          unoptimized={true}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                          <p className="text-muted-foreground">Image not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
