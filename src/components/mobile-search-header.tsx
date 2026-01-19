"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MobileSearchHeaderProps = {
    onSearch: (query: string) => void;
    onCartClick: () => void;
    cartCount: number;
};

const MobileSearchHeader = ({ onSearch, onCartClick, cartCount }: MobileSearchHeaderProps) => {
    return (
        <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-sm pt-[10px] pb-3">
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
                            />
                        </Link>
                    </div>

                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                        <Input
                            type="search"
                            placeholder="Search"
                            className="w-full pl-12 pr-4 h-12 bg-white border-none shadow-search"
                            onChange={(e) => onSearch(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>
                    
                    <div className="relative flex-shrink-0">
                        <Button variant="ghost" size="icon" className="relative h-12 w-12" onClick={onCartClick}>
                            <ShoppingCart className="h-6 w-6 text-white" />
                            <span className="sr-only">View Cart</span>
                        </Button>
                        {cartCount > 0 && (
                            <Badge variant="default" className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full flex items-center justify-center p-1 text-xs bg-primary text-primary-foreground">
                                {cartCount}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileSearchHeader;
