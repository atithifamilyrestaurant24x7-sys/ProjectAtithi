"use client";

import * as React from 'react';
import Image from 'next/image';
import { type MenuItem } from "@/lib/menu";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Phone, Star, Filter, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, Menu, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { type CartItem } from '@/app/page';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { WhatsappIcon } from '../icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const CategoryProductDialog = ({
    isOpen,
    onOpenChange,
    category,
    cart,
    onAddToCart,
    onRemoveFromCart,
    onCardClick,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    category: { name: string; items: MenuItem[] } | null;
    cart: CartItem[];
    onAddToCart: (item: MenuItem) => void;
    onRemoveFromCart: (itemName: string) => void;
    onCardClick: (item: MenuItem) => void;
}) => {
    if (!category) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 w-full h-full max-w-full rounded-none border-0 flex flex-col top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-90 data-[state=closed]:animate-out">
                <DialogHeader className="p-4 border-b flex-row items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    <DialogTitle className="text-xl">{category.name}</DialogTitle>
                     <DialogClose asChild>
                        <Button variant="ghost" size="icon">
                            <X className="h-5 w-5" />
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <ScrollArea className="flex-grow bg-background">
                    <div className="p-4 space-y-4">
                        {category.items.map(item => (
                            <MobileProductCard
                                key={item.name}
                                item={item}
                                cartItem={cart.find(ci => ci.name === item.name)}
                                onAddToCart={onAddToCart}
                                onRemoveFromCart={onRemoveFromCart}
                                onCardClick={onCardClick}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};


const useSyncCarousel = (apis: (CarouselApi | undefined)[], enabled: boolean) => {
    React.useEffect(() => {
        if (!enabled || apis.some(api => !api)) {
            return;
        }
        const [api1, api2] = apis as CarouselApi[];

        let isScrolling1 = false;
        let isScrolling2 = false;

        const onSelect1 = () => {
            if (!isScrolling2) {
                isScrolling1 = true;
                if (api1 && api2 && api2.selectedScrollSnap() !== api1.selectedScrollSnap()) {
                    api2.scrollTo(api1.selectedScrollSnap(), true);
                }
                isScrolling1 = false;
            }
        };
        const onSelect2 = () => {
            if (!isScrolling1) {
                isScrolling2 = true;
                if (api1 && api2 && api1.selectedScrollSnap() !== api2.selectedScrollSnap()) {
                    api1.scrollTo(api2.selectedScrollSnap(), true);
                }
                isScrolling2 = false;
            }
        };
        
        api1?.on("select", onSelect1);
        api2?.on("select", onSelect2);
        
        const timeout = setTimeout(() => {
            if (api1 && api2 && api1.selectedScrollSnap() !== api2.selectedScrollSnap()) {
                api2.scrollTo(api1.selectedScrollSnap(), true);
            }
        }, 100);


        return () => {
            api1?.off("select", onSelect1);
            api2?.off("select", onSelect2);
            clearTimeout(timeout);
        };
    }, [apis, enabled]);
};

const FilteredProductDialog = ({ 
    isOpen, 
    onOpenChange, 
    items, 
    categoryName,
    cart,
    onAddToCart,
    onRemoveFromCart
}: { 
    isOpen: boolean, 
    onOpenChange: (open: boolean) => void, 
    items: MenuItem[], 
    categoryName: string,
    cart: CartItem[],
    onAddToCart: (item: MenuItem) => void,
    onRemoveFromCart: (itemName: string) => void
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-background/90 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Filtered Results: {categoryName}</DialogTitle>
                    <DialogDescription>
                        Here are the products matching your criteria.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
                    <div className="space-y-4">
                        {items.length > 0 ? items.map(item => {
                            const cartItem = cart.find(ci => ci.name === item.name);
                            return (
                                <div key={item.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border bg-secondary/30">
                                    <div className='mb-3 sm:mb-0'>
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">Rs. {item.price}</p>
                                    </div>
                                    <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                        {cartItem ? (
                                            <div className="flex items-center justify-between gap-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onRemoveFromCart(item.name)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="font-bold w-8 text-center">{cartItem.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAddToCart(item)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" className="bg-primary flex-grow sm:flex-grow-0" onClick={() => onAddToCart(item)}>
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Add
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" className="hover:bg-accent dark:bg-transparent dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground flex-grow sm:flex-grow-0" asChild>
                                            <Link href="tel:8250104315">
                                                <Phone className="mr-2 h-4 w-4" /> Call to Order
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-muted-foreground text-center py-8">No items match your filter.</p>}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export const ProductDetailDialog = ({
    isOpen,
    onOpenChange,
    item,
    cartItem,
    onAddToCart,
    onRemoveFromCart,
    onRate,
    onCartClick,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    item: MenuItem;
    cartItem?: CartItem;
    onAddToCart: (item: MenuItem) => void;
    onRemoveFromCart: (itemName: string) => void;
    onRate: (itemName: string, rating: number) => void;
    onCartClick: () => void;
}) => {
    const [hoveredRating, setHoveredRating] = React.useState(0);
    const [currentRating, setCurrentRating] = React.useState(item.rating);
    const [ratingsCount, setRatingsCount] = React.useState(item.ratingsCount);
    const { toast } = useToast();
    
    const imageData = PlaceHolderImages.find(img => img.id === item.name);
    const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
    const whatsappOrderUrl = `https://wa.me/918250104315?text=${encodeURIComponent(`Hello, I would like to order: ${item.name}`)}`;

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

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 w-full h-full max-w-full rounded-none border-0 flex flex-col top-0 left-0 translate-x-0 translate-y-0 md:flex-row md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-90 data-[state=closed]:animate-out">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative md:min-h-[500px] h-[40%] md:h-auto flex-shrink-0">
                    <div className="absolute inset-0">
                        {imageData ? (
                            <Image src={imageData.imageUrl} alt={item.description} layout="fill" objectFit="cover" data-ai-hint={imageData.imageHint} className="md:rounded-l-lg"/>
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
                        <div className="p-6 md:p-8 flex flex-col h-full space-y-6">
                            <DialogHeader className="text-left">
                                <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">{item.name}</DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground pt-2">{item.description}</DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex-grow space-y-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-bold text-4xl text-primary">Rs. {item.price}</span>
                                    {item.originalPrice && <del className="text-xl text-muted-foreground">Rs. {item.originalPrice}</del>}
                                </div>
                                
                                <Separator className="bg-border/50" />

                                <div className="space-y-4">
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
                            
                            <div className="flex flex-col gap-3 pt-4">
                                {cartItem ? (
                                    <div className="w-full flex items-center justify-between gap-4 p-2 border-2 bg-background rounded-lg">
                                        <span className="font-semibold text-lg ml-2">In Cart</span>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md" onClick={() => onRemoveFromCart(item.name)}>
                                                <Minus className="h-5 w-5" />
                                            </Button>
                                            <span className="font-bold text-xl w-10 text-center">{cartItem.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md" onClick={() => onAddToCart(item)}>
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button size="lg" className="w-full bg-primary h-14 text-lg" onClick={() => onAddToCart(item)}>
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                                    </Button>
                                )}
                                 <Button size="lg" variant="outline" className="w-full h-14 text-lg" onClick={onCartClick}>
                                    View Cart
                                 </Button>
                                <Button size="lg" variant="outline" className="w-full bg-transparent text-foreground hover:bg-green-500 hover:text-white dark:hover:bg-green-600 h-14 text-lg border-2 border-green-500 hover:border-green-500" asChild>
                                    <Link href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer">
                                        <WhatsappIcon className="mr-2 h-5 w-5" /> Order on WhatsApp
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary h-14 text-lg border-2 border-primary hover:border-primary" asChild>
                                  <Link href="tel:8250104315">
                                      <Phone className="mr-2 h-5 w-5" /> Call to Order
                                  </Link>
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};


const ProductRow = React.memo(({ 
    items, 
    setApi, 
    carouselId,
    cart,
    onAddToCart,
    onRemoveFromCart,
    isSyncEnabled,
    onCardClick,
}: { 
    items: MenuItem[], 
    setApi: (api: CarouselApi) => void,
    carouselId: string,
    cart: CartItem[],
    onAddToCart: (item: MenuItem) => void,
    onRemoveFromCart: (itemName: string) => void,
    isSyncEnabled: boolean
    onCardClick: (item: MenuItem) => void,
}) => {
    const [api, setLocalApi] = React.useState<CarouselApi>();
    const [ratings, setRatings] = React.useState<{ [key: string]: number }>({});
    const scrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      if (api) {
        setApi(api);
      }
    }, [api, setApi]);

    const scrollPrev = React.useCallback(() => api && api.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api && api.scrollNext(), [api]);

    const startScrolling = React.useCallback((direction: 'prev' | 'next') => {
        if (!isSyncEnabled) return;
        if (scrollIntervalRef.current) return;
        scrollIntervalRef.current = setInterval(() => {
            if (api) {
                if (direction === 'next') scrollNext();
                else scrollPrev();
            }
        }, 300);
    }, [api, isSyncEnabled, scrollNext, scrollPrev]);

    const stopScrolling = React.useCallback(() => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    }, []);
    
    React.useEffect(() => {
        return () => stopScrolling();
    }, [stopScrolling]);

    return (
        <div className="w-full relative group/carousel">
            <Carousel
                setApi={setLocalApi}
                opts={{ align: "start", loop: true, dragFree: true }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 py-4">
                    {items.map((item, index) => {
                        const imageData = PlaceHolderImages.find(img => img.id === item.name);
                        const cartItem = cart.find(cartItem => cartItem.name === item.name);
                        const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

                        return (
                            <CarouselItem 
                                key={`${carouselId}-${item.name}-${index}`}
                                className="pl-4 basis-[80%] sm:basis-[33%]"
                            >
                                <div className="p-1 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                                onClick={() => onCardClick(item)}
                                >
                                  <div className="w-full bg-card rounded-[30px] border flex flex-col group">
                                      <div className="relative w-full aspect-[4/3]">
                                          {imageData ? (
                                              <Image
                                                  src={imageData.imageUrl}
                                                  alt={item.description}
                                                  fill
                                                  data-ai-hint={imageData.imageHint}
                                                  className="object-cover rounded-t-[30px]"
                                              />
                                          ) : (
                                              <div className="w-full h-full bg-secondary rounded-t-[30px] flex items-center justify-center">
                                                  <span className="text-muted-foreground text-sm">No Image</span>
                                              </div>
                                          )}
                                          {discount > 0 && <Badge variant="destructive" className="absolute top-2 right-2 sm:top-4 sm:right-4">{discount}% OFF</Badge>}
                                      </div>
                                      <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
                                          <div>
                                              <h3 className="font-['Lucida_Sans'] text-sm sm:text-base font-semibold text-foreground truncate">{item.name}</h3>
                                              <p className="font-['Lucida_Sans'] text-[#999999] text-xs mt-1 truncate">{item.description}</p>
                                              <div className="mt-2 flex items-center gap-2">
                                                  <div className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={cn(
                                                            "h-4 w-4",
                                                            i < item.rating ? "text-accent fill-accent" : "text-muted-foreground"
                                                        )} />
                                                    ))}
                                                  </div>
                                                  <span className="text-xs text-muted-foreground">({item.ratingsCount})</span>
                                              </div>
                                              <div className="flex items-baseline gap-2 mt-2">
                                                  <span className="font-bold text-base sm:text-lg">Rs. {item.price}</span>
                                                  {item.originalPrice && <del className="text-sm text-muted-foreground">Rs. {item.originalPrice}</del>}
                                              </div>
                                          </div>

                                          <div className="mt-2 space-y-2">
                                            {cartItem ? (
                                                <div className="w-full flex items-center justify-between gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => {e.stopPropagation(); onRemoveFromCart(item.name);}}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="font-bold text-lg">{cartItem.quantity}</span>
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => {e.stopPropagation(); onAddToCart(item);}}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button className="w-full bg-primary" onClick={(e) => {e.stopPropagation(); onAddToCart(item)}}>
                                                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                                </Button>
                                            )}
                                            <Button variant="outline" className="w-full bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground" asChild>
                                                <Link href="tel:8250104315" onClick={(e) => e.stopPropagation()}>
                                                    <Phone className="mr-2 h-4 w-4" /> Call to Order
                                                </Link>
                                            </Button>
                                          </div>
                                      </div>
                                  </div>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
            
            <div className="absolute inset-y-0 left-0 hidden md:flex items-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={scrollPrev}
                    className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-30 ml-4"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-0 hidden md:flex items-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={scrollNext}
                    className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-30 mr-4"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            <div 
                className="absolute top-0 left-0 h-full w-1/4 z-20 hidden md:block"
                onMouseEnter={() => startScrolling('prev')}
                onMouseLeave={stopScrolling}
            />
            <div 
                className="absolute top-0 right-0 h-full w-1/4 z-20 hidden md:block"
                onMouseEnter={() => startScrolling('next')}
                onMouseLeave={stopScrolling}
            />
            
        </div>
    );
});
ProductRow.displayName = 'ProductRow';


const ProductCategory = ({ 
    category, 
    cart, 
    onAddToCart, 
    onRemoveFromCart,
    onCardClick,
}: { 
    category: { name: string, items: MenuItem[] },
    cart: CartItem[],
    onAddToCart: (item: MenuItem) => void,
    onRemoveFromCart: (itemName: string) => void,
    onCardClick: (item: MenuItem) => void,
}) => {
    const [api1, setApi1] = React.useState<CarouselApi>();
    const [api2, setApi2] = React.useState<CarouselApi>();
    const [sortedItems, setSortedItems] = React.useState([...category.items]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogItems, setDialogItems] = React.useState<MenuItem[]>([]);
    const [isSyncEnabled, setIsSyncEnabled] = React.useState(true);
    const [selectedSort, setSelectedSort] = React.useState('default');


    React.useEffect(() => {
        // Disable sync for touch devices to prevent weird scrolling behavior
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            setIsSyncEnabled(false);
        }
    }, []);

    const apis = React.useMemo(() => [api1, api2], [api1, api2]);
    useSyncCarousel(apis, isSyncEnabled);
    
    React.useEffect(() => {
        api1?.reInit();
        api2?.reInit();
    }, [sortedItems, api1, api2]);


    React.useEffect(() => {
        setSortedItems([...category.items]);
    }, [category.items]);

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        if (value === 'default') {
            setIsSyncEnabled(true);
            setSortedItems([...category.items]);
            setTimeout(() => {
                api1?.reInit();
                api2?.reInit();
            }, 100);
            return;
        };

        let newSortedItems = [...category.items];
        if (value === 'low-to-high') {
            newSortedItems.sort((a, b) => a.price - b.price);
        } else if (value === 'rating') {
            newSortedItems.sort((a, b) => b.rating - a.rating);
        } else if (value === 'offers') {
            newSortedItems = newSortedItems.filter(item => item.originalPrice);
        }
        
        setDialogItems(newSortedItems);
        setDialogOpen(true);
    };
    
    const midPoint = Math.ceil(sortedItems.length / 2);
    const row1Items = sortedItems.slice(0, midPoint);
    const row2Items = sortedItems.slice(midPoint);
    
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h3 id={category.name.toLowerCase().replace(/\s+/g, '-')} className="text-2xl md:text-3xl font-bold flex items-center gap-4 mb-4 md:mb-0 text-foreground scroll-mt-24">
                    {category.name}
                </h3>
                <div className='flex items-center gap-4'>
                    <Select onValueChange={handleSortChange} value={selectedSort}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                            <SelectItem value="rating">Rating: High to Low</SelectItem>
                            <SelectItem value="offers">Only Offers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div
              onMouseEnter={() => {
                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                if (!isTouchDevice) setIsSyncEnabled(true);
              }}
              onMouseLeave={() => {
                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                if (!isTouchDevice) setIsSyncEnabled(true);
              }}
            >
              <ProductRow items={row1Items} setApi={setApi1} carouselId={`${category.name}-1`} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} isSyncEnabled={isSyncEnabled} onCardClick={onCardClick} />
              {row2Items.length > 0 && <ProductRow items={row2Items} setApi={setApi2} carouselId={`${category.name}-2`} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} isSyncEnabled={isSyncEnabled} onCardClick={onCardClick} />}
            </div>

            <FilteredProductDialog 
                isOpen={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setSelectedSort('default');
                    }
                }}
                items={dialogItems}
                categoryName={category.name}
                cart={cart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
            />
        </div>
    )
}

const MobileProductCard = ({ item, cartItem, onAddToCart, onRemoveFromCart, onCardClick }: {
    item: MenuItem;
    cartItem?: CartItem;
    onAddToCart: (item: MenuItem) => void;
    onRemoveFromCart: (itemName: string) => void;
    onCardClick: (item: MenuItem) => void;
}) => {
    const imageData = PlaceHolderImages.find(img => img.id === item.name);
    const isFeatured = item.name === 'Paneer Tikka (6 pcs)';

    const AddButton = ({isSmall}: {isSmall?: boolean}) => (
        <Button 
            className={cn(
                "rounded-md bg-primary text-sm text-white hover:bg-primary/90",
                isSmall ? "px-3 h-9" : "px-4 h-10"
            )} 
            onClick={(e) => {e.stopPropagation(); onAddToCart(item)}}
        >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add
        </Button>
    );

    const QuantityCounter = ({isSmall}: {isSmall?: boolean}) => (
        <div className={cn(
            "flex items-center justify-between gap-1 bg-primary/10 rounded-md",
            isSmall ? "h-9 px-1" : "h-10 px-2"
        )}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-primary" onClick={(e) => {e.stopPropagation(); onRemoveFromCart(item.name);}}>
                <Minus className="h-5 w-5" />
            </Button>
            <span className={cn("font-bold text-center text-primary", isSmall ? "w-4 text-sm" : "w-6 text-base" )}>{cartItem?.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-primary" onClick={(e) => {e.stopPropagation(); onAddToCart(item);}}>
                <Plus className="h-5 w-5" />
            </Button>
        </div>
    );

    if (isFeatured) {
        // Large Card Layout (like Paneer Tikka)
        return (
             <div className="w-full overflow-hidden bg-card rounded-xl shadow-product" onClick={() => onCardClick(item)}>
                <div className="relative aspect-video w-full">
                    {imageData ? <Image src={imageData.imageUrl} alt={item.description} fill data-ai-hint={imageData.imageHint} className="object-cover rounded-t-xl" /> : <div className="bg-muted w-full h-full rounded-t-xl"/>}
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <div className="flex-grow min-w-0">
                           <h3 className="font-semibold text-lg text-foreground truncate">{item.name}</h3>
                        </div>
                        <p className="font-bold text-lg text-foreground flex-shrink-0">Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                            <Star className="h-4 w-4 text-[#F2C94C] fill-[#F2C94C]" />
                            <span className="text-sm font-medium text-foreground">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({item.ratingsCount})</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                    <div className="flex justify-end items-center gap-2 flex-shrink-0">
                        <Button asChild variant="outline" className="h-10">
                            <Link href="tel:8250104315" onClick={(e) => e.stopPropagation()}>
                                <Phone className="mr-2 h-4 w-4" /> Call to Order
                            </Link>
                        </Button>
                        {cartItem ? <QuantityCounter /> : <AddButton />}
                    </div>
                </div>
            </div>
        );
    }

    // Standard Card Layout
    return (
        <div className="grid grid-cols-[80px_1fr] gap-3 w-full overflow-hidden bg-card rounded-xl shadow-product p-3 items-center" onClick={() => onCardClick(item)}>
            {/* Column 1: Image */}
            <div className="relative w-20 h-20 flex-shrink-0">
                {imageData ? <Image src={imageData.imageUrl} alt={item.description} fill data-ai-hint={imageData.imageHint} className="object-cover rounded-lg" /> : <div className="bg-muted w-full h-full rounded-lg"/>}
            </div>
            
            {/* Column 2: Content */}
            <div className="flex flex-col min-w-0 h-full">
                <h3 className="font-semibold text-base text-foreground truncate">{item.name}</h3>
                <div className="flex items-center gap-2 my-1">
                    <div className="flex items-center gap-0.5">
                        <Star className="h-4 w-4 text-[#F2C94C] fill-[#F2C94C]" />
                        <span className="text-xs font-bold text-foreground">{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({item.ratingsCount})</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 flex-grow">{item.description}</p>
                <div className="flex justify-between items-end mt-2">
                    <p className="font-bold text-base text-foreground pr-2">Rs. {item.price}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button asChild variant="outline" size="icon" className="h-9 w-9">
                           <Link href="tel:8250104315" onClick={(e) => e.stopPropagation()}>
                                <Phone className="h-4 w-4" />
                            </Link>
                        </Button>
                         {cartItem ? <QuantityCounter isSmall /> : <AddButton isSmall />}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ProductSection = ({ allMenuItems, cart, onAddToCart, onRemoveFromCart, onCardClick, onRate, searchQuery }: {
  allMenuItems: { name: string, items: MenuItem[] }[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemName: string) => void;
  onCardClick: (item: MenuItem) => void;
  onRate: (itemName: string, rating: number) => void;
  searchQuery?: string;
}) => {
    const [selectedCategory, setSelectedCategory] = React.useState<{ name: string; items: MenuItem[] } | null>(null);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);

    const handleOpenCategoryDialog = (category: { name: string, items: MenuItem[] }) => {
        setSelectedCategory(category);
        setIsCategoryDialogOpen(true);
    };

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

        if (categoryResults.length > 0) {
            return categoryResults;
        }

        return flatMenuItems.filter(item =>
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery)
        );
    }, [searchQuery, allMenuItems, flatMenuItems]);


  return (
    <section id="products" className="pb-6 md:py-32 bg-background overflow-hidden relative">
      <div className="container mx-auto px-0 md:px-4">
        
        {searchQuery ? (
             <div className="md:hidden px-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Search Results for "{searchQuery}"</h2>
                <ScrollArea className="h-[70vh]">
                    <div className="space-y-4">
                        {searchResults.length > 0 ? (
                            searchResults.map(item => (
                                <MobileProductCard 
                                    key={item.name}
                                    item={item}
                                    cartItem={cart.find(ci => ci.name === item.name)}
                                    onAddToCart={onAddToCart}
                                    onRemoveFromCart={onRemoveFromCart}
                                    onCardClick={onCardClick}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-10">No products found matching your search.</p>
                        )}
                    </div>
                </ScrollArea>
             </div>
        ) : (
            <>
                <div className="hidden md:block">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Explore Our Menu
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            A wide variety of dishes to satisfy every craving, from
                            traditional flavors to modern delights.
                        </p>
                    </div>

                    <div className="space-y-12">
                    {allMenuItems.map((category) => (
                        <ProductCategory 
                            key={category.name} 
                            category={{...category, items: category.items}}
                            cart={cart} 
                            onAddToCart={onAddToCart} 
                            onRemoveFromCart={onRemoveFromCart}
                            onCardClick={onCardClick}
                        />
                    ))}
                    </div>
                </div>

                <div className='block md:hidden'>
                    <div className="mx-4 mb-[18px]">
                        <div className="bg-white rounded-xl shadow-filters p-2">
                             <div className="grid grid-cols-2 gap-2">
                                <Select onValueChange={(value) => {
                                    if (value === 'all') {
                                        return;
                                    }
                                    const category = allMenuItems.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === value);
                                    if (category) {
                                        handleOpenCategoryDialog(category);
                                    }
                                }}
                                suppressHydrationWarning={true}
                                >
                                    <SelectTrigger className="h-12 bg-white text-foreground border-border rounded-xl text-[15px] font-medium px-[18px]" suppressHydrationWarning={true}>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {allMenuItems.map(category => (
                                            <SelectItem 
                                                key={category.name} 
                                                value={category.name.toLowerCase().replace(/\s+/g, '-')}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select defaultValue="popular" suppressHydrationWarning={true}>
                                    <SelectTrigger className="h-12 bg-white text-foreground border-border rounded-xl text-[15px] font-medium px-[18px]" suppressHydrationWarning={true}>
                                        <SelectValue placeholder="Sort by: Popular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Sort by: Popular</SelectItem>
                                        <SelectItem value="rating">Sort by: Rating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className='px-4'>
                        <h2 className="text-xl font-semibold text-foreground">Categories</h2>
                         <div className="mt-4 border-b border-border"></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 px-4 pt-4">
                        {allMenuItems.map((category) => {
                             const firstItem = category.items[0];
                             const imageData = firstItem ? PlaceHolderImages.find(img => img.id === firstItem.name) : null;
                             const itemCount = category.items.length;
                        
                            return (
                                <button key={category.name} onClick={() => handleOpenCategoryDialog(category)} className="border-0 bg-card rounded-[14px] shadow-card-subtle overflow-hidden text-left w-full focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2 aspect-square" suppressHydrationWarning={true}>
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0">
                                            {imageData ? (
                                                <Image
                                                    src={imageData.imageUrl}
                                                    alt={`Preview of ${category.name}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                    <Menu className="w-8 h-8 text-muted-foreground/50"/>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                                        <div className="relative h-full flex flex-col justify-end p-3 drop-shadow-lg">
                                            <h3 className="font-semibold text-xl text-white">{category.name}</h3>
                                            <p className="text-[13px] text-white/90">{itemCount} items</p>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <CategoryProductDialog
                        isOpen={isCategoryDialogOpen}
                        onOpenChange={setIsCategoryDialogOpen}
                        category={selectedCategory}
                        cart={cart}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                        onCardClick={onCardClick}
                    />
                </div>
            </>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
