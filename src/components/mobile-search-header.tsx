
"use client";

import * as React from "react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { config } from "@/app/config";

type MobileSearchHeaderProps = {
    onSearch: (query: string) => void;
    onCartClick: () => void;
    cartCount: number;
};

const MobileSearchHeader = ({ onSearch, onCartClick, cartCount }: MobileSearchHeaderProps) => {
    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between gap-4">
                    <div className="text-2xl font-bold text-foreground">
                        <Link href="/">{config.brandName}</Link>
                    </div>
                    
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search dishes..."
                            className="w-full pl-12 pr-4 h-12 rounded-full bg-secondary border-none focus-visible:ring-2 focus-visible:ring-primary"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
                            <ShoppingCart className="h-6 w-6" />
                            <span className="sr-only">View Cart</span>
                        </Button>
                        {cartCount > 0 && (
                            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center p-1 text-xs">
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
