"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chat, ChatOutput } from "@/ai/flows/chat";
import { type MenuItem, menuData } from "@/lib/menu";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type MobileAISheetProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddToCart?: (items: MenuItem[]) => void;
};

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    suggestedDish?: string;
    suggestedItems?: string[];
    recommendedDishes?: {
        name: string;
        price: number;
        description?: string;
        rating?: number;
        ratingsCount?: number;
        image?: string; // Dynamic food photo URL
    }[];
    cartItems?: { name: string; price: number; quantity: number }[];
    totalPrice?: number;
    actionType?: string;
};

const quickPrompts = [
    { label: "🍛 খাবার সাজেশন দাও", prompt: "আজকে কি খাব? একটা ভালো খাবার suggest করো" },
    { label: "📍 Location", prompt: "তোমাদের restaurant কোথায়?" },
    { label: "🕐 সময়সূচী", prompt: "কখন থেকে কখন পর্যন্ত খোলা থাকে?" },
    { label: "📞 Contact", prompt: "কিভাবে যোগাযোগ করব?" },
];

export default function MobileAISheet({ isOpen, onClose, onAddToCart }: MobileAISheetProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // For manual order button redirect
    const router = useRouter();

    // Get user's locale
    const getUserLocale = () => {
        if (typeof navigator !== "undefined") {
            return navigator.language || "en-US";
        }
        return "en-US";
    };

    // Keyboard handling with visualViewport API
    const [viewportHeight, setViewportHeight] = useState<number>(
        typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 800
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            if (window.visualViewport) {
                const vh = window.visualViewport.height;
                setViewportHeight(vh);

                const keyboardH = window.innerHeight - vh;
                const isOpen = keyboardH > 100;
                setKeyboardHeight(isOpen ? keyboardH : 0);
                setIsKeyboardOpen(isOpen);

                // Scroll to bottom when keyboard opens
                if (isOpen && messagesEndRef.current) {
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            } else {
                setViewportHeight(window.innerHeight);
            }
        };

        // Initial check
        handleResize();

        window.visualViewport?.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("scroll", handleResize);

        // Also listen to window resize for fallback
        window.addEventListener("resize", handleResize);

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("scroll", handleResize);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Lock body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    // Scroll to bottom on new messages - with delay for state update
    useEffect(() => {
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Add welcome message when first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const locale = getUserLocale();
            const welcomeMsg = locale.startsWith("bn")
                ? "নমস্কার! 🙏 আমি Atithi AI। আপনার সাহায্যের জন্য এখানে আছি। কী জানতে চান?"
                : locale.startsWith("hi")
                    ? "नमस्ते! 🙏 मैं Atithi AI हूं। आपकी मदद के लिए यहां हूं। क्या जानना चाहते हैं?"
                    : "Hello! 🙏 I'm Atithi AI. How can I help you today?";

            setMessages([{ id: "welcome", role: "ai", content: welcomeMsg }]);
        }
    }, [isOpen, messages.length]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Convert previous messages to history format
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
                content: m.content
            }));

            const response: ChatOutput = await chat({
                message: text.trim(),
                userLocale: getUserLocale(),
                history: history
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response.response,
                suggestedDish: response.suggestedDish,
                suggestedItems: response.suggestedItems,
                recommendedDishes: response.recommendedDishes,
                cartItems: response.cartItems,
                totalPrice: response.totalPrice,
                actionType: response.actionType,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error: any) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: "ai",
                content: "দুঃখিত, আমি এখন উত্তর দিতে পারছি না। সংযোগ চেক করুন। (Sorry, I'm having trouble connecting right now.)"
            };

            // Check for specific API key error (usually starts with 400 or has typical Google text)
            if (error?.message?.includes('API key') || error?.message?.includes('400')) {
                errorMsg.content = "API কনফিগারেশন এরর পাওয়া গেছে। দয়া করে এডমিনের সাথে যোগাযোগ করুন। (API Configuration Error)";
            }

            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    const handleReset = () => {
        setMessages([]);
        setInput("");
        onClose();
        setTimeout(() => {
            // Re-open if needed or just reset state
            // Logic to clear history in chat.ts is not needed as history is passed per request
        }, 100);
    };

    // Improved Order Handler
    const handleOrder = (dishName: string) => {
        // Try to add to cart directly first
        if (onAddToCart) {
            let foundItem: MenuItem | undefined;
            // Strict case-insensitive match strict first
            for (const category of menuData) {
                const item = category.items.find(i => i.name.toLowerCase() === dishName.toLowerCase().trim());
                if (item) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                onAddToCart([foundItem]);
                onClose();
                return;
            }
        }

        // Fallback: Search and Scroll
        onClose();
        const url = new URL(window.location.href);
        url.searchParams.set("search", dishName);
        window.history.pushState({}, "", url);
        window.dispatchEvent(new Event("popstate"));

        setTimeout(() => {
            const menuElement = document.getElementById("menu");
            if (menuElement) {
                menuElement.scrollIntoView({ behavior: "smooth" });
            }
            toast({
                title: "Found in Menu",
                description: `Now showing: ${dishName}`,
            });
        }, 300);
    };

    const handleAddToCartAction = (items: { name: string; quantity: number }[]) => {
        if (!onAddToCart) return;

        const menuItemsToAdd: MenuItem[] = [];
        const missingItems: string[] = [];

        items.forEach(cartItem => {
            let foundItem: MenuItem | undefined;
            for (const category of menuData) {
                // Enhanced robust matching: case insensitive, trimmed
                // Could add fuzzy match if needed, but exact is safer for ordering
                const item = category.items.find(i => i.name.toLowerCase() === cartItem.name.toLowerCase().trim());
                if (item) {
                    foundItem = item;
                    break;
                }
            }

            if (foundItem) {
                // Add quantity times
                for (let i = 0; i < cartItem.quantity; i++) {
                    menuItemsToAdd.push(foundItem);
                }
            } else {
                missingItems.push(cartItem.name);
            }
        });

        if (menuItemsToAdd.length > 0) {
            onAddToCart(menuItemsToAdd);
            onClose();
        }

        if (missingItems.length > 0) {
            toast({
                variant: "destructive",
                title: "Some items not found",
                description: `Could not find: ${missingItems.join(", ")}`,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed z-[60] flex flex-col md:hidden"
            style={{
                height: `${viewportHeight}px`,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            {/* Backdrop - covers full screen */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 z-[-1]"
                onClick={onClose}
            />

            {/* Sheet Container - takes full available height */}
            <div
                ref={sheetRef}
                className="relative w-full h-full bg-slate-50 rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-800">Atithi AI</h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full text-slate-400 hover:text-slate-600">
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-red-500">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-muted/10 overscroll-contain">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm animate-in slide-in-from-bottom-2 duration-300",
                                msg.role === "ai"
                                    ? "bg-white border text-foreground self-start rounded-tl-sm"
                                    : "bg-amber-600 text-white self-end rounded-tr-sm ml-auto"
                            )}
                        >
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Suggested Dish - Only for food_recommendation without ordering */}
                            {msg.suggestedDish && !msg.cartItems && msg.actionType === 'food_recommendation' && !msg.recommendedDishes && (
                                <div className="mt-3 flex flex-col gap-2">
                                    <div className="px-3 py-2 bg-amber-50 rounded-lg text-amber-800 text-xs font-semibold border border-amber-100 flex items-center gap-2">
                                        <span>🍛</span>
                                        <span>Try: {msg.suggestedDish}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95 transition-all text-xs h-8"
                                        onClick={() => handleSend(`${msg.suggestedDish} দাও`)}
                                    >
                                        এটা নেব 👍
                                    </Button>
                                </div>
                            )}

                            {/* RICH CARDS: Recommended Dishes (Horizontal Scroll) */}
                            {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
                                <div className="mt-3 -mx-2 px-2 overflow-x-auto pb-3 flex gap-3 snap-x hide-scrollbar">
                                    {msg.recommendedDishes.map((dish, idx) => (
                                        <div
                                            key={idx}
                                            className="min-w-[180px] max-w-[180px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm snap-center flex flex-col"
                                        >
                                            {/* Food Image */}
                                            {dish.image && (
                                                <div className="w-full h-24 overflow-hidden bg-slate-100">
                                                    <img
                                                        src={dish.image}
                                                        alt={dish.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-2.5 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{dish.name}</h4>
                                                    <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1">
                                                        ₹{dish.price}
                                                    </span>
                                                </div>

                                                {dish.rating && (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <span className="text-amber-500 text-xs">★</span>
                                                        <span className="text-[10px] text-slate-600 font-medium">{dish.rating} ({(dish.ratingsCount || 0) > 100 ? '100+' : dish.ratingsCount})</span>
                                                    </div>
                                                )}

                                                <div className="mt-auto pt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="w-full h-7 text-xs bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200 shadow-none"
                                                        onClick={() => handleSend(`${dish.name} দাও`)}
                                                    >
                                                        Add Option +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Item Added - Show suggestions + action buttons */}
                            {msg.actionType === 'item_added' && (
                                <div className="mt-3 flex flex-col gap-3">
                                    {/* Show current items added */}
                                    {msg.cartItems && msg.cartItems.length > 0 && (
                                        <div className="bg-green-50 p-2 rounded-lg border border-green-100 text-xs text-green-700">
                                            ✅ {msg.cartItems.map(i => `${i.quantity}x ${i.name}`).join(', ')} added
                                        </div>
                                    )}

                                    {/* Suggested Items buttons */}
                                    {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {msg.suggestedItems.map((item, idx) => (
                                                <Button
                                                    key={idx}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-7 border-amber-200 text-amber-700 hover:bg-amber-50"
                                                    onClick={() => handleSend(`${item} দাও`)}
                                                >
                                                    + {item}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs h-9 border-blue-200 text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleSend("আরো সাজেশন দাও")}
                                        >
                                            আরো যোগ করুন
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-9 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleSend("Total দেখাও")}
                                        >
                                            টোটাল দেখুন
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Show Total - Display summary, ask for confirmation */}
                            {msg.actionType === 'show_total' && msg.cartItems && msg.cartItems.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                    <div className="text-xs font-semibold text-amber-800 mb-1">
                                        📋 আপনার অর্ডার:
                                    </div>
                                    {msg.cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-amber-700">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-amber-300 my-1"></div>
                                    <div className="flex justify-between font-bold text-sm text-amber-900">
                                        <span>Total</span>
                                        <span>₹{msg.totalPrice}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs h-9 border-gray-300"
                                            onClick={() => handleSend("আরো কিছু যোগ করো")}
                                        >
                                            আরো যোগ করুন
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 text-xs h-9 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleSend("হ্যাঁ, checkout করো")}
                                        >
                                            ✓ Confirm
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart - Final checkout button */}
                            {msg.actionType === 'add_to_cart' && msg.cartItems && msg.cartItems.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="text-xs font-semibold text-green-800 mb-1">
                                        ✅ Order Confirmed:
                                    </div>
                                    {msg.cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-green-700">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-green-200 my-1"></div>
                                    <div className="flex justify-between font-bold text-sm text-green-900">
                                        <span>Total</span>
                                        <span>₹{msg.totalPrice}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white shadow-md active:scale-95 transition-all"
                                        onClick={() => handleAddToCartAction(msg.cartItems!)}
                                    >
                                        🛒 Add to Cart & Checkout
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm px-4">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Atithi is typing...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts - Grid Layout */}
                {messages.length <= 1 && !isLoading && (
                    <div className="px-4 pb-2">
                        <div className="grid grid-cols-2 gap-2">
                            {quickPrompts.map((qp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(qp.prompt)}
                                    className="px-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-600 shadow-sm active:scale-95 transition-all hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-center"
                                >
                                    {qp.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t sticky bottom-0">
                    <div className="relative flex items-center gap-2">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything..."
                                className="w-full pl-4 pr-4 py-3 bg-slate-100 border-0 rounded-full focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-[15px] placeholder:text-slate-400"
                            />
                        </div>
                        <Button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className={cn(
                                "h-11 w-11 rounded-full shadow-md transition-all duration-300",
                                input.trim()
                                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-105 active:scale-95"
                                    : "bg-slate-200 text-slate-400"
                            )}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
