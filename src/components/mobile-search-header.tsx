
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { type MenuItem } from "@/lib/menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type MobileSearchHeaderProps = {
    onSearch: (query: string) => void;
    searchQuery: string;
    allMenuItems: { name: string; items: MenuItem[] }[];
    onProductSelect: (item: MenuItem) => void;
};

const MobileSearchHeader = ({ onSearch, searchQuery, allMenuItems, onProductSelect }: MobileSearchHeaderProps) => {
    const flatMenuItems = React.useMemo(() => allMenuItems.flatMap(c => c.items), [allMenuItems]);

    const searchResults = React.useMemo(() => {
        if (!searchQuery) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();

        let categoryResults: MenuItem[] = [];
        if (lowerCaseQuery.includes('non veg')) {
            const chickenCategory = allMenuItems.find(cat => cat.name.toLowerCase().includes('chicken'));
            const muttonCategory = allMenuItems.find(cat => cat.name.toLowerCase().includes('mutton'));
            if (chickenCategory) categoryResults.push(...chickenCategory.items);
            if (muttonCategory) categoryResults.push(...muttonCategory.items);
        } else {
            const matchedCategory = allMenuItems.find(cat => cat.name.toLowerCase().includes(lowerCaseQuery));
            if (matchedCategory) {
                categoryResults = matchedCategory.items;
            }
        }

        const itemResults = flatMenuItems.filter(item =>
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery)
        );

        const combined = [...categoryResults, ...itemResults];
        const uniqueResults = Array.from(new Map(combined.map(item => [item.name, item])).values());

        return uniqueResults;
    }, [searchQuery, allMenuItems, flatMenuItems]);

    const handleResultClick = (item: MenuItem) => {
        onProductSelect(item);
        onSearch('');
    }

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#fcf7f3] pt-[10px] pb-3 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <Image
                                    src="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/atithifamilyrestaurant24x7@gmail.com's%20Org/ChatGPT%20Image%20Jan%2020,%202026,%2012_52_38%20AM.png"
                                    alt="Atithi Logo"
                                    width={80}
                                    height={40}
                                    className="h-10 w-auto"
                                    priority
                                    quality={75}
                                />
                            </Link>
                        </div>

                        <div className="group flex-grow relative">
                            <Search className="icon" />
                            <input
                                type="text"
                                placeholder="Search for dishes"
                                className="input"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                suppressHydrationWarning
                            />
                            {searchQuery && (
                                <button onClick={() => onSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {searchQuery && (
                <div className="fixed inset-0 bg-background z-30 md:hidden">
                    <ScrollArea className="h-full">
                        <div className="container mx-auto px-4 pb-2 pt-[63px]">
                            {searchResults.length > 0 ? (
                                <>
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">Showing results for "{searchQuery}"</p>
                                    <div className="space-y-2 pt-2">
                                        {searchResults.map(item => {
                                            const imageData = PlaceHolderImages.find(img => img.id === item.name);
                                            return (
                                                <button key={item.name} onClick={() => handleResultClick(item)} className="w-full text-left flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                        {imageData ? (
                                                            <Image src={imageData.imageUrl} alt={item.name} fill className="object-cover" loading="lazy" quality={75} />
                                                        ) : (
                                                            <div className="w-full h-full bg-muted"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">Rs. {item.price}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="font-semibold">No results found</p>
                                    <p className="text-sm text-muted-foreground">Try searching for something else.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </>
    );
};

export default MobileSearchHeader;
