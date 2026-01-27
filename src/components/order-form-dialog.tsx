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
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).max(15),
    date: z.string().optional(),
    time: z.string().optional(),
    deliveryOption: z.enum(['delivery', 'dine-in', 'take-away'], { required_error: "Please select an option." }),
    address: z.string().optional(),
    pincode: z.string().optional(),
    paymentMethod: z.enum(['pay-now', 'cod']).optional(),
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
        if (!data.paymentMethod) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['paymentMethod'],
                message: 'Please select a payment method.',
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
            time: '12:00',
            deliveryOption: 'delivery',
            address: '',
            pincode: '',
            paymentMethod: 'cod',
        },
    });

    const deliveryOption = form.watch('deliveryOption');

    const onSubmit = (data: OrderFormValues) => {
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`).join('\n');
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        let orderType: string;
        switch (data.deliveryOption) {
            case 'delivery':
                orderType = 'Delivery';
                break;
            case 'dine-in':
                orderType = 'Dine-in';
                break;
            case 'take-away':
                orderType = 'Take Away';
                break;
            default:
                orderType = 'Not specified';
        }
        
        let formattedDate = '';
        if (data.date) {
            formattedDate = new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        
        let formattedTime = '';
        if (data.time) {
            const timeString = data.time;
            const [hours, minutes] = timeString.split(':');
            const hoursInt = parseInt(hours, 10);
            const ampm = hoursInt >= 12 ? 'PM' : 'AM';
            const formattedHours = hoursInt % 12 || 12; // Convert 0 to 12
            formattedTime = `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
        }

        let customerDetails = `*Customer Details:*\nName: ${data.name}\nPhone: ${data.phone}\nOrder Type: ${orderType}`;
        
        if (formattedDate) {
            customerDetails += `\nDate: ${formattedDate}`;
        }
        if(formattedTime) {
            customerDetails += `\nTime: ${formattedTime}`;
        }

        if (data.deliveryOption === 'delivery') {
            customerDetails += `\nAddress: ${data.address}\nPincode: ${data.pincode}`;
            if (data.paymentMethod) {
                const paymentMethodText = data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay Now';
                customerDetails += `\nPayment Method: ${paymentMethodText}`;
            }
        }

        const message = `Hello Atithi, I would like to place the following order:\n\n*Order Summary:*\n${orderDetails}\n\n*Total: Rs. ${totalPrice.toFixed(2)}*\n\n${customerDetails}\n\nPlease confirm this order.`;

        const whatsappUrl = `https://wa.me/918250104315?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full h-full max-w-none max-h-none rounded-none top-0 left-0 translate-x-0 translate-y-0 flex flex-col border-0 p-0">
                <DialogHeader className="flex-shrink-0 p-4 border-b">
                    <DialogTitle>Complete Your Order</DialogTitle>
                    <DialogDescription>Please provide your details to proceed with the order.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                  <div className="p-4">
                    <Form {...form}>
                        <form id="order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="take-away" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Take Away</FormLabel>
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
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <input
                                                type="time"
                                                className="input w-full"
                                                {...field}
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
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Payment Method</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex space-x-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="cod" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="pay-now" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Pay Now</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </form>
                    </Form>
                  </div>
                </ScrollArea>
                <DialogFooter className="flex-shrink-0 p-4 border-t">
                    <Button type="submit" form="order-form" className="w-full">
                        Send Order on WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
