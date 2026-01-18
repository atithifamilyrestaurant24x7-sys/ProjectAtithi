
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, List, Menu as MenuIcon, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { menuData } from "@/lib/menu";
import { cn } from "@/lib/utils";

type MobileSearchHeaderProps = {
    onSearch: (query: string) => void;
    onRecommendClick: () => void;
    onCartClick: () => void;
    onMenuClick: () => void;
    cartCount: number;
};

const MobileSearchHeader = ({ onSearch, onRecommendClick, onCartClick, onMenuClick, cartCount }: MobileSearchHeaderProps) => {
    
    const handleCategorySelect = (categoryId: string) => {
        if (categoryId === 'all') {
            onSearch(''); // Clear search to show all
            window.scrollTo({ top: document.getElementById('products')?.offsetTop, behavior: 'smooth' });
            return;
        }
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const buttonClasses = "h-9 text-xs truncate";

    return (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm p-4 border-b">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for dishes..."
                    className="w-full pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex w-full gap-2">
                    <div className="w-1/2">
                        <Select onValueChange={handleCategorySelect}>
                            <SelectTrigger className={cn("w-full justify-center", buttonClasses)}>
                                <List className="mr-2 h-4 w-4" />
                                <span className="text-[10px] leading-none">
                                    <SelectValue placeholder="Categories" />
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                {menuData.map(category => (
                                    <SelectItem 
                                        key={category.name} 
                                        value={category.name.toLowerCase().replace(/\s+/g, '-')}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button variant="outline" onClick={onMenuClick} className={cn("w-1/2", buttonClasses)}>
                        <MenuIcon className="mr-2 h-4 w-4" />
                        Menu
                    </Button>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={onRecommendClick} className={cn("w-1/2", buttonClasses)}>
                        <span className="text-[10px] leading-none">AI Recommendation</span>
                    </Button>
                    <Button variant="outline" className={cn("relative w-1/2", buttonClasses)} onClick={onCartClick}>
                        <ShoppingCart className="h-5 w-5" />
                        <span className='ml-2'>Cart</span>
                        {cartCount > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center p-1">
                                {cartCount}
                            </Badge>
                        )}
                        <span className="sr-only">View Cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MobileSearchHeader;
