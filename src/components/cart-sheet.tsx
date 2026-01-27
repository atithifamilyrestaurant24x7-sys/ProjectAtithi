"use client";

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Phone, Plus, Minus, X } from 'lucide-react';
import { type CartItem } from '@/app/page';
import { type MenuItem } from '@/lib/menu';
import { WhatsappIcon } from './icons';
import { OrderFormDialog } from './order-form-dialog';
import { cn } from '@/lib/utils';

type CartSheetProps = {
    cart: CartItem[];
    onEmptyCart: () => void;
    onAddToCart: (item: MenuItem) => void;
    onRemoveFromCart: (itemName: string) => void;
    children?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const CartSheet = ({ 
    cart, 
    onEmptyCart, 
    onAddToCart, 
    onRemoveFromCart, 
    children, 
    isOpen, 
    onOpenChange 
}: CartSheetProps) => {
    const [isOrderFormOpen, setIsOrderFormOpen] = React.useState(false);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalSavings = cart.reduce((total, item) => {
        if (item.originalPrice) {
            return total + (item.originalPrice - item.price) * item.quantity;
        }
        return total;
    }, 0);

    const handleOrderOnWhatsAppClick = () => {
        if (onOpenChange) {
            onOpenChange(false);
        }
        setIsOrderFormOpen(true);
    };

    const content = (
        <SheetContent className={cn(
            "bg-[#F8F5F0] text-[#3D3227] p-0 flex flex-col",
            "inset-0 w-full h-full border-0" // Make it full-screen on all devices
        )}>
            <SheetHeader className="p-6 pb-4 flex-shrink-0 sticky top-0 bg-[#F8F5F0]/95 backdrop-blur-sm z-10">
                <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
                {cart.length > 0 && <p className="text-sm text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'} • Ready to order</p>}
                <SheetClose className="absolute right-4 top-4 rounded-full opacity-70 p-1 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                </SheetClose>
            </SheetHeader>
            
            <div className="flex-grow overflow-y-auto">
                {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center p-10">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground/30" strokeWidth={1.5} />
                        <p className="mt-4 font-semibold text-lg">Your cart is empty</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add items from the menu to get started.</p>
                    </div>
                ) : (
                    <div className="p-6 pt-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.name} className="flex justify-between items-center bg-white/60 p-4 rounded-[18px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                                <div className="flex-grow">
                                    <p className="font-bold text-base">{item.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Rs. {item.price} per plate
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mx-4">
                                    <div className="flex items-center gap-1 bg-[#F0EBE3] p-1 rounded-full">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-[#8C6D46] hover:bg-[#E6D9C5]" onClick={() => onRemoveFromCart(item.name)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="font-bold w-5 text-center text-sm">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-[#8C6D46] hover:bg-[#E6D9C5]" onClick={() => onAddToCart(item)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="font-semibold w-16 text-right text-base">Rs. {(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-6 border-t border-black/10 bg-[#F8F5F0]/95 backdrop-blur-sm flex-shrink-0 space-y-4">
                     <div className="space-y-2">
                         {totalSavings > 0 && (
                            <>
                                <div className="flex justify-between items-center text-sm font-medium text-green-600">
                                    <span>Total Savings:</span>
                                    <span>- Rs. {totalSavings.toFixed(2)}</span>
                                </div>
                                <Separator className="bg-black/10"/>
                            </>
                        )}
                        <div className="flex justify-between items-center font-bold text-xl pt-2">
                            <span>Grand Total:</span>
                            <span>Rs. {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                        <Button size="lg" disabled={cart.length === 0} className="w-full h-12 rounded-xl text-white bg-gradient-to-r from-[#B08942] to-[#D4B56E] shadow-lg" asChild>
                            <Link href="tel:8250104315">
                                <Phone className="mr-2 h-4 w-4" /> Call to Order
                            </Link>
                        </Button>
                        <Button size="lg" disabled={cart.length === 0} className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20A952] text-white shadow-lg" onClick={handleOrderOnWhatsAppClick}>
                            <WhatsappIcon className="mr-2 h-4 w-4" /> Order on WhatsApp
                        </Button>
                        <Button size="lg" variant="destructive" className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg" onClick={onEmptyCart}>
                            Empty Cart
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
    );

    if (children) {
        return (
            <React.Fragment>
                <Sheet open={isOpen} onOpenChange={onOpenChange}>
                    {children}
                    {content}
                </Sheet>
                <OrderFormDialog isOpen={isOrderFormOpen} onOpenChange={setIsOrderFormOpen} cart={cart} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>{content}</Sheet>
            <OrderFormDialog isOpen={isOrderFormOpen} onOpenChange={setIsOrderFormOpen} cart={cart} />
        </React.Fragment>
    );
};

export default CartSheet;
