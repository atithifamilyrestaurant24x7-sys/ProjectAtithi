
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Phone, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MenuItem, menuData } from "@/lib/menu";
import { type CartItem } from '@/app/page';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { WhatsappIcon } from './icons';
import { OrderFormDialog } from './order-form-dialog';

export const ProductDetailDialog = ({
    isOpen,
    onOpenChange,
    item,
    cartItem,
    cart,
    onAddToCart,
    onRemoveFromCart,
    onRate,
    onCartClick,
    onSelectItem,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    item: MenuItem;
    cartItem?: CartItem;
    cart: CartItem[];
    onAddToCart: (item: MenuItem) => void;
    onRemoveFromCart: (itemName: string) => void;
    onRate: (itemName: string, rating: number) => void;
    onCartClick: () => void;
    onSelectItem: (item: MenuItem) => void;
}) => {
    const [hoveredRating, setHoveredRating] = React.useState(0);
    const [currentRating, setCurrentRating] = React.useState(item.rating);
    const [ratingsCount, setRatingsCount] = React.useState(item.ratingsCount);
    const [isOrderFormOpen, setIsOrderFormOpen] = React.useState(false);
    const { toast } = useToast();

    const imageData = PlaceHolderImages.find(img => img.id === item.name);
    const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

    const suggestedItems = React.useMemo(() => {
        if (!item) return [];
        const currentCategory = menuData.find(category =>
            category.items.some(menuItem => menuItem.name === item.name)
        );
        if (!currentCategory) return [];
        return currentCategory.items.filter(menuItem => menuItem.name !== item.name).slice(0, 4);
    }, [item]);

    const handleRatingSubmit = (rating: number) => {
        const newTotalRatingPoints = (currentRating * ratingsCount) + rating;
        const newRatingsCount = ratingsCount + 1;
        const newAverageRating = newTotalRatingPoints / newRatingsCount;

        setCurrentRating(newAverageRating);
        setRatingsCount(newRatingsCount);
        onRate(item.name, rating);

        toast({
            title: "Rating Submitted",
            description: `You rated ${item.name} ${rating} stars.`,
        });
    };

    React.useEffect(() => {
        setCurrentRating(item.rating);
        setRatingsCount(item.ratingsCount);
    }, [item]);

    // Create a temporary cart for the form that includes the current item
    const effectiveCart = React.useMemo(() => {
        const itemInCart = cart.some(ci => ci.name === item.name);
        if (!itemInCart) {
            return [...cart, { ...item, quantity: 1 }];
        }
        return cart;
    }, [cart, item]);


    return (
        <React.Fragment>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="p-0 w-full h-full max-w-full md:max-w-4xl md:h-auto md:max-h-[600px] flex flex-col md:flex-row rounded-none md:rounded-lg border-0 top-0 left-0 translate-x-0 translate-y-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-90 data-[state=closed]:animate-out">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 relative h-[40%] md:h-auto flex-shrink-0">
                        <div className="absolute inset-0">
                            {imageData ? (
                                <Image src={imageData.imageUrl} alt={item.description} fill data-ai-hint={imageData.imageHint} className="object-cover md:rounded-l-lg" quality={75} />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center md:rounded-l-lg">
                                    <span className="text-muted-foreground">No Image</span>
                                </div>
                            )}
                            {discount > 0 && <Badge variant="destructive" className="absolute top-4 right-4 text-base px-3 py-1">{discount}% OFF</Badge>}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 bg-background md:rounded-r-lg flex flex-col flex-grow min-h-0">
                        <ScrollArea className="h-full">
                            <div className="p-6 md:p-8">
                                <DialogHeader className="text-left mb-4">
                                    <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">{item.name}</DialogTitle>
                                    <DialogDescription className="text-base text-muted-foreground pt-2">{item.description}</DialogDescription>
                                </DialogHeader>

                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="font-bold text-4xl text-primary">Rs. {item.price}</span>
                                    {item.originalPrice && <del className="text-xl text-muted-foreground">Rs. {item.originalPrice}</del>}
                                </div>

                                <Separator />

                                <div className="my-6 space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-lg">Ratings</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={cn("h-5 w-5", i < Math.round(currentRating) ? "text-accent fill-accent" : "text-muted-foreground/50")} />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {currentRating.toFixed(1)} ({ratingsCount} ratings)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-lg">Rate this product</h4>
                                        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "h-8 w-8 cursor-pointer transition-all",
                                                        (hoveredRating > 0 ? i < hoveredRating : i < Math.round(currentRating))
                                                            ? "text-accent fill-accent scale-110"
                                                            : "text-muted-foreground/50 hover:text-accent/50"
                                                    )}
                                                    onMouseEnter={() => setHoveredRating(i + 1)}
                                                    onClick={() => handleRatingSubmit(i + 1)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-6 border-t">
                                    {cartItem ? (
                                        <div className="w-full flex items-center justify-between gap-2 p-2 border-2 bg-primary/10 rounded-lg">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md text-primary" onClick={() => onRemoveFromCart(item.name)}>
                                                <Minus className="h-5 w-5" />
                                            </Button>
                                            <span className="font-bold text-xl w-10 text-center text-primary">{cartItem.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md text-primary" onClick={() => onAddToCart(item)}>
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button size="lg" className="w-full" onClick={() => onAddToCart(item)}>
                                            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                                        </Button>
                                    )}
                                    <Button size="lg" variant="secondary" className="w-full" onClick={onCartClick}>
                                        View Cart
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white" onClick={() => setIsOrderFormOpen(true)}>
                                        <WhatsappIcon className="mr-2 h-5 w-5" /> Order on WhatsApp
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full" asChild>
                                        <Link href="tel:8250104315">
                                            <Phone className="mr-2 h-5 w-5" /> Call to Order
                                        </Link>
                                    </Button>
                                </div>

                                {suggestedItems.length > 0 && (
                                    <div className="space-y-4 pt-8 mt-8 border-t">
                                        <h4 className="font-semibold text-lg">You might also like</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {suggestedItems.map(suggestedItem => {
                                                const suggestedImageData = PlaceHolderImages.find(img => img.id === suggestedItem.name);
                                                return (
                                                    <button key={suggestedItem.name} onClick={() => onSelectItem(suggestedItem)} className="text-left w-full rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-secondary transition-colors overflow-hidden">
                                                        <div className="relative aspect-square w-full">
                                                            {suggestedImageData ? (
                                                                <Image src={suggestedImageData.imageUrl} alt={suggestedItem.name} fill className="object-cover" loading="lazy" quality={75} />
                                                            ) : (
                                                                <div className="w-full h-full bg-muted rounded-t-lg" />
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="font-semibold text-sm truncate">{suggestedItem.name}</p>
                                                            <p className="text-xs text-muted-foreground">Rs. {suggestedItem.price}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
            <OrderFormDialog
                isOpen={isOrderFormOpen}
                onOpenChange={setIsOrderFormOpen}
                cart={effectiveCart}
            />
        </React.Fragment>
    );
};
