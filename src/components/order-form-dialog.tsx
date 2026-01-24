'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { type CartItem } from '@/app/page';

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).max(15),
    date: z.string({ required_error: "Please select a date." }),
    deliveryOption: z.enum(['delivery', 'dine-in'], { required_error: "Please select an option." }),
    address: z.string().optional(),
    pincode: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.deliveryOption === 'delivery') {
        if (!data.address || data.address.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['address'],
                message: 'Address is required for delivery.',
            });
        }
        if (!data.pincode || data.pincode.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['pincode'],
                message: 'A valid 6-digit pincode is required for delivery.',
            });
        }
    }
});

type OrderFormValues = z.infer<typeof formSchema>;

type OrderFormDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    cart: CartItem[];
};

export function OrderFormDialog({ isOpen, onOpenChange, cart }: OrderFormDialogProps) {
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            date: new Date().toISOString().split('T')[0],
            deliveryOption: 'delivery',
            address: '',
            pincode: '',
        },
    });

    const deliveryOption = form.watch('deliveryOption');

    const onSubmit = (data: OrderFormValues) => {
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`).join('\n');
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const orderType = data.deliveryOption === 'delivery' ? 'Delivery' : 'Dine-in';
        
        const formattedDate = new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        let customerDetails = `*Customer Details:*\nName: ${data.name}\nPhone: ${data.phone}\nOrder Type: ${orderType}\nDate: ${formattedDate}`;

        if (data.deliveryOption === 'delivery') {
            customerDetails += `\nAddress: ${data.address}\nPincode: ${data.pincode}`;
        }

        const message = `Hello Atithi, I would like to place the following order:\n\n*Order Summary:*\n${orderDetails}\n\n*Total: Rs. ${totalPrice.toFixed(2)}*\n\n${customerDetails}\n\nPlease confirm this order.`;

        const whatsappUrl = `https://wa.me/918250104315?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Complete Your Order</DialogTitle>
                    <DialogDescription>Please provide your details to proceed with the order.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="deliveryOption"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Order Option</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="delivery" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Delivery</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="dine-in" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Dine-in</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <input
                                            type="date"
                                            className="input w-full"
                                            {...field}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {deliveryOption === 'delivery' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Delivery Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your full address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pincode</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter your 6-digit pincode" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                Send Order on WhatsApp
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
