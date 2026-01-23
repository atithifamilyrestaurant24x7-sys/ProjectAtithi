'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Helper function to generate time slots
const generateTimeSlots = (startHour: number, endHour: number, interval: number) => {
    const slots = [];
    const now = new Date();
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const slotTime = new Date();
            slotTime.setHours(hour, minute, 0, 0);
            
            // Only add future time slots for the current day
            if (format(now, 'yyyy-MM-dd') === format(slotTime, 'yyyy-MM-dd') && slotTime < now) {
                continue;
            }
            
            const timeString = format(slotTime, 'hh:mm a');
            slots.push(timeString);
        }
    }
    return slots;
};


const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).max(15),
    deliveryOption: z.enum(['delivery', 'dine-in'], { required_error: "Please select an option." }),
    date: z.date({
        required_error: "A date is required.",
    }),
    time: z.string({
        required_error: "A time slot is required.",
    }).min(1, { message: "A time slot is required." }),
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
    const [timeSlots, setTimeSlots] = React.useState(generateTimeSlots(10, 22, 30));

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            deliveryOption: 'delivery',
            date: new Date(),
            time: '',
            address: '',
            pincode: '',
        },
    });

    const deliveryOption = form.watch('deliveryOption');
    const selectedDate = form.watch('date');

    React.useEffect(() => {
        const now = new Date();
        const isToday = selectedDate ? format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd') : false;

        const newTimeSlots = [];
        for (let hour = 10; hour < 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const slotTime = new Date(selectedDate);
                slotTime.setHours(hour, minute, 0, 0);

                if (isToday && slotTime < now) {
                    continue;
                }
                
                const timeString = format(slotTime, 'hh:mm a');
                newTimeSlots.push(timeString);
            }
        }
        setTimeSlots(newTimeSlots);
        
        // Reset time if it's no longer valid
        if (!newTimeSlots.includes(form.getValues('time'))) {
            form.setValue('time', '');
        }

    }, [selectedDate, form]);

    const onSubmit = (data: OrderFormValues) => {
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`).join('\n');
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const orderType = data.deliveryOption === 'delivery' ? 'Delivery' : 'Dine-in';
        const formattedDate = format(data.date, "PPP");

        let customerDetails = `*Customer Details:*\nName: ${data.name}\nPhone: ${data.phone}\nOrder Type: ${orderType}\nDate: ${formattedDate}\nTime: ${data.time}`;

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
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 opacity-50" />
                                                        <SelectValue placeholder="Select a time" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {timeSlots.length > 0 ? timeSlots.map(slot => (
                                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                                )) : <SelectItem value="disabled" disabled>No slots available</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>

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
