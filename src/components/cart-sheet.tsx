
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Phone, Plus, Minus } from 'lucide-react';
import { type CartItem } from '@/app/page';
import { type MenuItem } from '@/lib/menu';
import { cn } from '@/lib/utils';
import { WhatsappIcon } from './icons';

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
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalSavings = cart.reduce((total, item) => {
        if (item.originalPrice) {
            return total + (item.originalPrice - item.price) * item.quantity;
        }
        return total;
    }, 0);

    const generateWhatsAppMessage = () => {
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`).join('\n');
        const message = `Hello, I would like to place the following order:\n\n${orderDetails}\n\nTotal: Rs. ${totalPrice.toFixed(2)}`;
        return `https://wa.me/918250104315?text=${encodeURIComponent(message)}`;
    };

    const content = (
        <SheetContent className="p-0 flex flex-col bg-background">
            <SheetHeader className="p-6 border-b bg-background">
                <SheetTitle className="text-xl font-semibold">Your Cart</SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto bg-background">
                {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center p-10">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground/30" strokeWidth={1.5} />
                        <p className="mt-4 font-semibold text-lg text-foreground">Your cart is empty</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add items from the menu to get started.</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {cart.map(item => (
                            <div key={item.name} className="flex justify-between items-center bg-card p-4 rounded-xl border">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Rs. {item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => onRemoveFromCart(item.name)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-bold w-5 text-center text-sm">{item.quantity}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => onAddToCart(item)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="font-semibold w-24 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {cart.length > 0 && (
                <SheetFooter className="p-6 bg-background border-t mt-auto">
                    <div className="flex flex-col gap-4 w-full">
                        <div className='space-y-3'>
                            {totalSavings > 0 && (
                                <div className="flex justify-between items-center text-sm font-medium text-green-600">
                                    <span>Total Savings</span>
                                    <span>- Rs. {totalSavings.toFixed(2)}</span>
                                </div>
                            )}
                             <Separator />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>Rs. {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button size="lg" disabled={cart.length === 0} className="w-full" asChild>
                                <Link href="tel:8250104315">
                                    <Phone className="mr-2 h-4 w-4" /> Call to Order
                                </Link>
                            </Button>
                            <Button size="lg" disabled={cart.length === 0} className="w-full bg-green-500 hover:bg-green-600 text-white" asChild>
                                <Link href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                                    <WhatsappIcon className="mr-2 h-4 w-4" /> Order on WhatsApp
                                </Link>
                            </Button>
                            <Button size="lg" variant="destructive" className="w-full" onClick={onEmptyCart}>
                                Empty Cart
                            </Button>
                        </div>
                    </div>
                </SheetFooter>
            )}
        </SheetContent>
    );

    // If children are provided, it's used with a trigger (desktop header)
    if (children) {
        return <Sheet>{children}{content}</Sheet>;
    }

    // If no children, it's controlled programmatically (mobile FAB)
    return <Sheet open={isOpen} onOpenChange={onOpenChange}>{content}</Sheet>;
};

export default CartSheet;
