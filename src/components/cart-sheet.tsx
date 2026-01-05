

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
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}`).join('\n');
        const message = `Hello, I would like to place the following order:\n\n${orderDetails}\n\nTotal: Rs. ${totalPrice.toFixed(2)}`;
        return `https://wa.me/918250104315?text=${encodeURIComponent(message)}`;
    };

    const content = (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="py-4 h-full flex flex-col">
                {cart.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-muted-foreground">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto pr-4">
                        {cart.map(item => (
                            <div key={item.name} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Rs. {item.price}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onRemoveFromCart(item.name)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-bold">{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAddToCart(item)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="font-semibold w-16 text-right">Rs. {item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                )}
                <Separator className="my-4" />
                <SheetFooter>
                    <div className="flex flex-col gap-4 w-full">
                        <div className='space-y-2'>
                            {totalSavings > 0 && (
                                <div className="flex justify-between items-center font-semibold text-green-500">
                                    <span>You Saved</span>
                                    <span>Rs. {totalSavings.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>Rs. {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button disabled={cart.length === 0} className="w-full" asChild>
                            <Link href="tel:8250104315">
                                <Phone className="mr-2 h-4 w-4" /> Call to Order
                            </Link>
                        </Button>
                         <Button disabled={cart.length === 0} className="w-full bg-green-500 hover:bg-green-600 text-white" asChild>
                            <Link href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                                <WhatsappIcon className="mr-2 h-4 w-4" /> Order on WhatsApp
                            </Link>
                        </Button>
                        {cart.length > 0 && (
                            <Button variant="destructive" className="w-full" onClick={onEmptyCart}>
                                Empty Cart
                            </Button>
                        )}
                    </div>
                </SheetFooter>
            </div>
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
